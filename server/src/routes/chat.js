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

// POST /api/chat - Send a message and get AI response
router.post('/', validateChatRequest, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
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
    const results = await retrieveRelevant(message, index, topK, { model });
    const guard = enforceGuardrails(results, { minScore: parseFloat(process.env.SCORE_THRESHOLD) || 0.35 });
    if (guard.allowed) {
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

    // Return the response
    res.json({
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
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
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

export default router;
