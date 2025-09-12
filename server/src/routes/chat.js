import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateChatRequest } from '../middleware/validation.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadIndex } from '../lib/indexStore.js';
import { retrieveRelevant } from '../lib/search.js';
import { enforceGuardrails, composeAnswer, formatStructured } from '../lib/guardrails.js';
import { rephraseAnswer } from '../lib/rephrase.js';

const router = express.Router();

// In-memory conversation storage (use DB in production)
const conversations = new Map();
const activeRequests = new Map();
const sessionUsage = new Map();
const requestCache = new Map();

// Session limits configuration
const SESSION_LIMITS = {
  maxRequestsPerHour: parseInt(process.env.SESSION_MAX_REQUESTS_PER_HOUR) || 10,
  maxRequestsPerDay: parseInt(process.env.SESSION_MAX_REQUESTS_PER_DAY) || 50,
  cacheExpiryMs: parseInt(process.env.REQUEST_CACHE_EXPIRY_MS) || 5 * 60 * 1000,
  staticCacheExpiryMs: parseInt(process.env.STATIC_CACHE_EXPIRY_MS) || 60 * 60 * 1000,
  requestTimeoutMs: parseInt(process.env.EMBEDDING_REQUEST_TIMEOUT_MS) || 30000
};

const STATIC_CONTENT_PATTERNS = [
  /contact/i, /email/i, /phone/i, /address/i, /location/i,
  /fun/i, /hobby/i, /hobbies/i, /interest/i, /interests/i,
  /skill/i, /skills/i, /technology/i, /technologies/i,
  /programming/i, /languages/i, /about/i, /who are you/i, /introduction/i
];

// ------------------ Helper Functions ------------------

// Generate session ID
function getSessionId(req) {
  return req.ip + '_' + (req.headers['user-agent'] || 'unknown');
}

// Rate limit check
function checkSessionLimits(sessionId) {
  const now = Date.now();
  const hourAgo = now - 3600_000;
  const dayAgo = now - 24 * 3600_000;

  if (!sessionUsage.has(sessionId)) {
    sessionUsage.set(sessionId, { requests: [], lastReset: now });
  }
  const usage = sessionUsage.get(sessionId);
  usage.requests = usage.requests.filter(ts => ts > dayAgo);

  const hourlyRequests = usage.requests.filter(ts => ts > hourAgo);
  if (hourlyRequests.length >= SESSION_LIMITS.maxRequestsPerHour) {
    return { allowed: false, reason: 'hourly_limit', resetTime: Math.min(...hourlyRequests) + 3600_000 };
  }
  if (usage.requests.length >= SESSION_LIMITS.maxRequestsPerDay) {
    return { allowed: false, reason: 'daily_limit', resetTime: Math.min(...usage.requests) + 24 * 3600_000 };
  }
  return { allowed: true };
}

// Record session usage
function recordSessionUsage(sessionId) {
  if (!sessionUsage.has(sessionId)) {
    sessionUsage.set(sessionId, { requests: [], lastReset: Date.now() });
  }
  sessionUsage.get(sessionId).requests.push(Date.now());
}

// Check if question is static content
function isStaticContent(question) {
  return STATIC_CONTENT_PATTERNS.some(pattern => pattern.test(question));
}

// Cache helpers
function getCachedResponse(question) {
  const key = question.toLowerCase().trim();
  const cached = requestCache.get(key);
  if (!cached) return null;

  const expiry = cached.isStatic ? SESSION_LIMITS.staticCacheExpiryMs : SESSION_LIMITS.cacheExpiryMs;
  if (Date.now() - cached.timestamp < expiry) return cached.data;

  requestCache.delete(key);
  return null;
}

function cacheResponse(question, data) {
  const key = question.toLowerCase().trim();
  const isStatic = isStaticContent(question);
  const expiry = isStatic ? SESSION_LIMITS.staticCacheExpiryMs : SESSION_LIMITS.cacheExpiryMs;

  requestCache.set(key, { data, timestamp: Date.now(), isStatic, expiresAt: Date.now() + expiry });
}

// Cleanup functions
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of activeRequests.entries()) {
    if (now - ts > SESSION_LIMITS.requestTimeoutMs) activeRequests.delete(key);
  }
}, 5 * 60 * 1000);

setInterval(() => {
  const now = Date.now();
  for (const [key, cached] of requestCache.entries()) {
    if (cached.expiresAt && now > cached.expiresAt) requestCache.delete(key);
  }
}, 10 * 60 * 1000);

// Rephrase helper
async function maybeRephrase(content, message) {
  if (String(process.env.REPHRASE_ENABLED || 'true') === 'true') {
    try { return { content: await rephraseAnswer(content, message), aiGenerated: true }; }
    catch { return { content, aiGenerated: false }; }
  }
  return { content, aiGenerated: false };
}

// Multi-entry query helper (projects / experience)
async function handleMultiEntryQuery(type, title, index, message) {
  const allDocs = index.documents.filter(doc => doc.type === type);
  if (!allDocs.length) return null;

  const allResults = allDocs.map(doc => ({ doc, score: 1.0 }));
  const composed = composeAnswer(allResults);
  const structured = { type, title, items: allResults.map(r => formatStructured(r.doc)) };

  const { content, aiGenerated } = await maybeRephrase(composed, message);
  return { content, structured, aiGenerated };
}

// Get or create conversation
function getOrCreateConversation(conversationId) {
  let conversation = conversations.get(conversationId);
  if (!conversation) {
    conversation = {
      id: conversationId || uuidv4(),
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    conversations.set(conversation.id, conversation);
  }
  return conversation;
}

// ------------------ POST /api/chat ------------------
router.post('/', validateChatRequest, async (req, res) => {
  const { message, conversationId } = req.body;
  const sessionId = getSessionId(req);

  // Rate limit
  const limitCheck = checkSessionLimits(sessionId);
  if (!limitCheck.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many requests. ${limitCheck.reason === 'hourly_limit' ? 'Hourly' : 'Daily'} limit reached.`,
      resetTime: new Date(limitCheck.resetTime).toISOString(),
      limitType: limitCheck.reason,
      timestamp: new Date().toISOString()
    });
  }

  // Cache check
  const cached = getCachedResponse(message);
  if (cached) return res.json(cached);

  const requestKey = message.toLowerCase().trim();
  if (activeRequests.has(requestKey)) {
    return res.status(409).json({
      error: 'Request in progress',
      message: 'A similar request is already being processed. Please wait.',
      timestamp: new Date().toISOString()
    });
  }

  activeRequests.set(requestKey, Date.now());
  recordSessionUsage(sessionId);

  try {
    const conversation = getOrCreateConversation(conversationId);

    // Add user message
    const userMessage = { id: uuidv4(), role: 'user', content: message, timestamp: new Date().toISOString() };
    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date().toISOString();

    // Load index
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const storageDir = process.env.STORAGE_DIR
      ? join(__dirname, '..', '..', process.env.STORAGE_DIR)
      : join(__dirname, '..', '..', 'storage');
      const index = loadIndex(storageDir);

      if (!index || !Array.isArray(index.documents)) {
        return res.status(503).json({
          error: 'Index not built or invalid',
          message: 'Please run ingestion first to build a proper knowledge index.',
          hint: 'POST /api/ingest',
          timestamp: new Date().toISOString()
        });
      }      

    const model = process.env.EMBEDDINGS_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
    const topK = parseInt(process.env.RETRIEVAL_TOP_K) || 3;

    let results;
    try { results = await retrieveRelevant(message, index, topK, { model }); }
    catch {
      const timestamp = new Date().toISOString();
      const responseId = uuidv4();
      return res.json({
        success: true,
        conversationId: conversation.id,
        response: { id: responseId, content: "Embedding service error. Try again later.", type: 'text', data: null, timestamp, aiGenerated: false },
        conversation: { id: conversation.id, messageCount: conversation.messages.length, createdAt: conversation.createdAt, updatedAt: conversation.updatedAt }
      });
    }

    // Determine multi-entry match
    let finalContent, data, aiGenerated = false;
    const lowerMsg = message.toLowerCase();

    if (/projects?/i.test(lowerMsg)) {
      const multi = await handleMultiEntryQuery('project', 'Projects', index, message);
      if (multi) { finalContent = multi.content; data = { structured: multi.structured }; aiGenerated = multi.aiGenerated; }
    } else if (/experience|work|internship|job/i.test(lowerMsg)) {
      const multi = await handleMultiEntryQuery('experience', 'Experience', index, message);
      if (multi) { finalContent = multi.content; data = { structured: multi.structured }; aiGenerated = multi.aiGenerated; }
    }
    // Fallback single result
    if (!finalContent) {
      const guard = enforceGuardrails(results, { minScore: parseFloat(process.env.SCORE_THRESHOLD) || 0.35 });
      
      if (guard.allowed && results.length > 0) {
        const composed = composeAnswer(results);
        const structured = formatStructured(results[0].doc);
        const rephrased = await maybeRephrase(composed, message);
        finalContent = rephrased.content;
        aiGenerated = rephrased.aiGenerated;
        data = { structured };
      } else if (results.length === 0) {
        finalContent = "I could not find any relevant information for your question.";
      } else {
        finalContent = guard.message;
      }
    }


    // Add AI response
    const responseId = uuidv4();
    const timestamp = new Date().toISOString();
    conversation.messages.push({ id: responseId, role: 'assistant', content: finalContent, timestamp, responseType: 'text', data });

    const responseData = {
      success: true,
      conversationId: conversation.id,
      response: { id: responseId, content: finalContent, type: 'text', data, timestamp, aiGenerated },
      conversation: { id: conversation.id, messageCount: conversation.messages.length, createdAt: conversation.createdAt, updatedAt: conversation.updatedAt }
    };

    cacheResponse(message, responseData);
    res.json(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', message: 'Failed to process chat message', timestamp: new Date().toISOString() });
  } finally {
    activeRequests.delete(requestKey);
  }
});

// GET /api/chat/conversation/:id - Get conversation history
router.get('/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = conversations.get(id);
    
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      conversation: {
        id: conversation.id,
        messages: conversation.messages,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/chat/conversations - List all conversations
router.get('/conversations', async (req, res) => {
  try {
    const conversationList = Array.from(conversations.values()).map(conv => ({
      id: conv.id,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.messages[conv.messages.length - 1]?.content || 'No messages'
    }));

    res.json({
      success: true,
      conversations: conversationList,
      total: conversationList.length
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch conversations',
      timestamp: new Date().toISOString()
    });
  }
});

// DELETE /api/chat/conversation/:id - Delete a conversation
router.delete('/conversation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = conversations.delete(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Conversation not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete conversation',
      timestamp: new Date().toISOString()
    });
  }
});

// Streaming endpoints removed to keep responses deterministic and KB-bound

// GET /api/chat/cache-status - Get cache statistics (for monitoring)
router.get('/cache-status', (req, res) => {
  const now = Date.now();
  let staticCount = 0;
  let regularCount = 0;
  let expiredCount = 0;
  
  for (const [key, cached] of requestCache.entries()) {
    if (cached.expiresAt && now > cached.expiresAt) {
      expiredCount++;
    } else if (cached.isStatic) {
      staticCount++;
    } else {
      regularCount++;
    }
  }
  
  res.json({
    cache: {
      totalEntries: requestCache.size,
      staticEntries: staticCount,
      regularEntries: regularCount,
      expiredEntries: expiredCount
    },
    activeRequests: activeRequests.size,
    sessionUsage: sessionUsage.size,
    limits: SESSION_LIMITS,
    timestamp: new Date().toISOString()
  });
});

export default router;
