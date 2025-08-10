import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import aiServer from '../services/aiServer.js';
import { validateChatRequest } from '../middleware/validation.js';

const router = express.Router();

// In-memory conversation storage (in production, use a database)
const conversations = new Map();

// POST /api/chat - Send a message and get AI response
router.post('/', validateChatRequest, async (req, res) => {
  try {
    const { message, conversationId, stream = false } = req.body;
    
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

    // If streaming is requested, use streaming response
    if (stream) {
      return handleStreamingResponse(req, res, message, conversation);
    }

    // Generate AI response
    const aiResponse = await aiServer.generateResponse(
      message, 
      conversation.messages.slice(-10) // Last 10 messages for context
    );

    // Add AI response to conversation
    conversation.messages.push({
      id: aiResponse.id,
      role: 'assistant',
      content: aiResponse.content,
      timestamp: aiResponse.timestamp,
      responseType: aiResponse.type,
      data: aiResponse.data
    });

    // Return the response
    res.json({
      success: true,
      conversationId: conversation.id,
      response: {
        id: aiResponse.id,
        content: aiResponse.content,
        type: aiResponse.type,
        data: aiResponse.data,
        timestamp: aiResponse.timestamp,
        aiGenerated: aiResponse.aiGenerated
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

// POST /api/chat/stream - Streaming chat endpoint
router.post('/stream', validateChatRequest, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string',
        timestamp: new Date().toISOString()
      });
    }

    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

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

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date().toISOString();

    // Stream the response
          const stream = aiServer.streamResponse(message, conversation.messages.slice(-10));
    
    for await (const chunk of stream) {
      if (chunk.type === 'token') {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      } else if (chunk.type === 'complete') {
        // Add AI response to conversation
        conversation.messages.push({
          id: chunk.id,
          role: 'assistant',
          content: chunk.content,
          timestamp: chunk.timestamp,
          responseType: chunk.responseType,
          data: chunk.data
        });
        
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        res.write('data: [DONE]\n\n');
        break;
      } else if (chunk.type === 'error') {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        res.write('data: [DONE]\n\n');
        break;
      }
    }

    res.end();

  } catch (error) {
    console.error('Error in streaming chat:', error);
    res.write(`data: ${JSON.stringify({
      type: 'error',
      content: 'Sorry, I encountered an error. Please try again.',
      isComplete: true
    })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Helper function for streaming responses
function handleStreamingResponse(req, res, message, conversation) {
  // Set headers for streaming
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Start streaming response
  const streamResponse = async () => {
    try {
      const stream = aiServer.streamResponse(message, conversation.messages.slice(-10));
      
      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        
        if (chunk.isComplete) {
          // Add AI response to conversation
          conversation.messages.push({
            id: chunk.id || uuidv4(),
            role: 'assistant',
            content: chunk.content,
            timestamp: chunk.timestamp || new Date().toISOString(),
            responseType: chunk.responseType,
            data: chunk.data
          });
          
          res.write('data: [DONE]\n\n');
          break;
        }
      }
      
      res.end();
    } catch (error) {
      console.error('Error in streaming response:', error);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        isComplete: true
      })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }
  };

  streamResponse();
}

export default router;
