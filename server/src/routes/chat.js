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
// In-memory conversation storage (in production, use a database)
const conversations = new Map();

// In-memory stores for rate limiting and deduplication
const activeRequests = new Map(); // Track active embedding requests
const sessionUsage = new Map(); // Track per-session usage
const requestCache = new Map(); // Cache for repeated questions

// Session limits configuration
const SESSION_LIMITS = {
  maxRequestsPerHour: parseInt(process.env.SESSION_MAX_REQUESTS_PER_HOUR) || 10,
  maxRequestsPerDay: parseInt(process.env.SESSION_MAX_REQUESTS_PER_DAY) || 50,
  cacheExpiryMs: parseInt(process.env.REQUEST_CACHE_EXPIRY_MS) || 5 * 60 * 1000, // 5 minutes
  staticCacheExpiryMs: parseInt(process.env.STATIC_CACHE_EXPIRY_MS) || 60 * 60 * 1000, // 1 hour for static content
  requestTimeoutMs: parseInt(process.env.EMBEDDING_REQUEST_TIMEOUT_MS) || 30000 // 30 seconds
};

// Static content patterns that should be cached longer
const STATIC_CONTENT_PATTERNS = [
  /contact/i,
  /email/i,
  /phone/i,
  /address/i,
  /location/i,
  /fun/i,
  /hobby/i,
  /hobbies/i,
  /interest/i,
  /interests/i,
  /skill/i,
  /skills/i,
  /technology/i,
  /technologies/i,
  /programming/i,
  /languages/i,
  /about/i,
  /who are you/i,
  /introduction/i
];

// Helper functions for rate limiting and caching
function getSessionId(req) {
  return req.ip + '_' + (req.headers['user-agent'] || 'unknown');
}

function checkSessionLimits(sessionId) {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  const dayAgo = now - (24 * 60 * 60 * 1000);
  
  if (!sessionUsage.has(sessionId)) {
    sessionUsage.set(sessionId, { requests: [], lastReset: now });
  }
  
  const usage = sessionUsage.get(sessionId);
  
  // Clean old requests
  usage.requests = usage.requests.filter(timestamp => timestamp > dayAgo);
  
  const hourlyRequests = usage.requests.filter(timestamp => timestamp > hourAgo);
  const dailyRequests = usage.requests.length;
  
  if (hourlyRequests.length >= SESSION_LIMITS.maxRequestsPerHour) {
    return { allowed: false, reason: 'hourly_limit', resetTime: Math.min(...hourlyRequests) + (60 * 60 * 1000) };
  }
  
  if (dailyRequests >= SESSION_LIMITS.maxRequestsPerDay) {
    return { allowed: false, reason: 'daily_limit', resetTime: Math.min(...usage.requests) + (24 * 60 * 60 * 1000) };
  }
  
  return { allowed: true };
}

function recordSessionUsage(sessionId) {
  const now = Date.now();
  if (!sessionUsage.has(sessionId)) {
    sessionUsage.set(sessionId, { requests: [], lastReset: now });
  }
  sessionUsage.get(sessionId).requests.push(now);
}

function isStaticContent(question) {
  return STATIC_CONTENT_PATTERNS.some(pattern => pattern.test(question));
}

function getCachedResponse(question) {
  const questionKey = question.toLowerCase().trim();
  const cached = requestCache.get(questionKey);
  
  if (cached) {
    const isStatic = isStaticContent(question);
    const cacheExpiry = isStatic ? SESSION_LIMITS.staticCacheExpiryMs : SESSION_LIMITS.cacheExpiryMs;
    
    if (Date.now() - cached.timestamp < cacheExpiry) {
      console.log(`Returning ${isStatic ? 'static' : 'regular'} cached response for:`, question);
      return cached.data;
    } else {
      // Remove expired cache entry
      requestCache.delete(questionKey);
    }
  }
  return null;
}

function cacheResponse(question, data) {
  const questionKey = question.toLowerCase().trim();
  const isStatic = isStaticContent(question);
  const cacheExpiry = isStatic ? SESSION_LIMITS.staticCacheExpiryMs : SESSION_LIMITS.cacheExpiryMs;
  
  requestCache.set(questionKey, {
    data,
    timestamp: Date.now(),
    isStatic,
    expiresAt: Date.now() + cacheExpiry
  });
  
  console.log(`Cached ${isStatic ? 'static' : 'regular'} response for:`, question, `(expires in ${Math.round(cacheExpiry / 1000 / 60)} minutes)`);
}

// Cleanup function to remove stale active requests
function cleanupStaleRequests() {
  const now = Date.now();
  for (const [key, timestamp] of activeRequests.entries()) {
    if (now - timestamp > SESSION_LIMITS.requestTimeoutMs) {
      activeRequests.delete(key);
      console.log('Cleaned up stale request:', key);
    }
  }
}

// Cleanup function to remove expired cache entries
function cleanupExpiredCache() {
  const now = Date.now();
  let cleanedCount = 0;
  
  for (const [key, cached] of requestCache.entries()) {
    if (cached.expiresAt && now > cached.expiresAt) {
      requestCache.delete(key);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired cache entries`);
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupStaleRequests, 5 * 60 * 1000);
// Run cache cleanup every 10 minutes
setInterval(cleanupExpiredCache, 10 * 60 * 1000);

// POST /api/chat - Send a message and get AI response
router.post('/', validateChatRequest, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const sessionId = getSessionId(req);
    
    // Check session limits
    const limitCheck = checkSessionLimits(sessionId);
    if (!limitCheck.allowed) {
      const resetTime = new Date(limitCheck.resetTime).toISOString();
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. ${limitCheck.reason === 'hourly_limit' ? 'Hourly' : 'Daily'} limit reached.`,
        resetTime,
        limitType: limitCheck.reason,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check cache first
    const cachedResponse = getCachedResponse(message);
    if (cachedResponse) {
      console.log('Returning cached response for:', message);
      return res.json(cachedResponse);
    }
    
    // Check for active request deduplication
    const requestKey = message.toLowerCase().trim();
    if (activeRequests.has(requestKey)) {
      console.log('Request already in progress for:', message);
      return res.status(409).json({
        error: 'Request in progress',
        message: 'A similar request is already being processed. Please wait.',
        timestamp: new Date().toISOString()
      });
    }
    
    // Mark request as active
    activeRequests.set(requestKey, Date.now());
    
    // Record session usage
    recordSessionUsage(sessionId);
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
        timestamp: new Date().toISOString()
      });
    }

    // Get or create conversation
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

    // Add user message to conversation
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date().toISOString();

    // Retrieval-augmented: query vector index first
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const storageDir = process.env.STORAGE_DIR ? join(__dirname, '..', '..', process.env.STORAGE_DIR) : join(__dirname, '..', '..', 'storage');
    const index = loadIndex(storageDir);

    let finalContent;
    let responseType = 'text';
    let aiGenerated = false;
    let data = undefined;

    if (!index) {
      return res.status(503).json({
        error: 'Index not built',
        message: 'Please run ingestion to build the knowledge index first.',
        hint: 'POST /api/ingest',
        timestamp: new Date().toISOString()
      });
    }

    const model = process.env.EMBEDDINGS_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
    const topK = parseInt(process.env.RETRIEVAL_TOP_K) || 3;
    
    let results;
    try {
      results = await retrieveRelevant(message, index, topK, { model });
    } catch (embeddingError) {
      console.error('Embedding service error:', embeddingError.message);
      // Fallback: return a generic response when embeddings fail
      return res.json({
        success: true,
        conversationId: conversation.id,
        response: {
          id: responseId,
          content: "I'm currently experiencing technical difficulties with my knowledge base. Please try again in a few minutes, or contact me directly for assistance.",
          type: 'text',
          data: null,
          timestamp,
          aiGenerated: false
        },
        conversation: {
          id: conversation.id,
          messageCount: conversation.messages.length,
          createdAt: conversation.createdAt,
          updatedAt: conversation.updatedAt
        }
      });
    }
    const guard = enforceGuardrails(results, { minScore: parseFloat(process.env.SCORE_THRESHOLD) || 0.35 });
    if (guard.allowed) {
      // Check if this is a general "projects" query
      const isProjectsQuery = /projects?/i.test(message) && !results.some(r => r.doc.type !== 'project');
      
      if (isProjectsQuery) {
        // For projects queries, get all projects from the index
        const allProjects = index.documents.filter(doc => doc.type === 'project');
        const allProjectResults = allProjects.map(project => ({
          doc: project,
          score: 1.0 // High score since we're explicitly asking for all projects
        }));
        
        const composed = composeAnswer(allProjectResults);
        const structured = {
          type: 'projects',
          title: 'Projects',
          projects: allProjectResults.map(r => formatStructured(r.doc))
        };
        
        const enableRephrase = String(process.env.REPHRASE_ENABLED || 'true') === 'true';
        if (enableRephrase) {
          try {
            finalContent = await rephraseAnswer(composed, message);
            aiGenerated = true;
          } catch (e) {
            finalContent = composed;
          }
        } else {
          finalContent = composed;
        }
        data = { structured };
      } else {
        // Regular single result handling
        const composed = composeAnswer(results);
        const structured = formatStructured(results[0].doc);
        const enableRephrase = String(process.env.REPHRASE_ENABLED || 'true') === 'true';
        if (enableRephrase) {
          try {
            finalContent = await rephraseAnswer(composed, message);
            aiGenerated = true;
          } catch (e) {
            finalContent = composed;
          }
        } else {
          finalContent = composed;
        }
        data = { structured };
      }
    } else {
      finalContent = guard.message;
    }

    // Add AI response to conversation
    const responseId = uuidv4();
    const timestamp = new Date().toISOString();
    conversation.messages.push({
      id: responseId,
      role: 'assistant',
      content: finalContent,
      timestamp,
      responseType,
      data
    });

    // Cache the response
    const responseData = {
      success: true,
      conversationId: conversation.id,
      response: {
        id: responseId,
        content: finalContent,
        type: responseType,
        data,
        timestamp,
        aiGenerated
      },
      conversation: {
        id: conversation.id,
        messageCount: conversation.messages.length,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    };
    
    // Cache the response for future identical requests
    cacheResponse(message, responseData);
    
    // Clean up active request
    activeRequests.delete(requestKey);
    
    // Return the response
    res.json(responseData);

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Clean up active request on error
    const requestKey = req.body?.message?.toLowerCase().trim();
    if (requestKey) {
      activeRequests.delete(requestKey);
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process chat message',
      timestamp: new Date().toISOString()
    });
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
