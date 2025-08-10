import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Import individual tools
import { getProfile } from '../services/tools/getProfile.js';
import { getProjects } from '../services/tools/getProjects.js';
import { getSkills } from '../services/tools/getSkills.js';
import { getResume } from '../services/tools/getResume.js';
import { getContact } from '../services/tools/getContact.js';
import { getPresentation } from '../services/tools/getPresentation.js';
import { getCrazy } from '../services/tools/getCrazy.js';
import { getInternship } from '../services/tools/getInternship.js';

class AIServer {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.model = process.env.MISTRAL_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    
    if (!this.apiKey) {
      console.warn('⚠️  HUGGINGFACE_API_KEY not found. AI features will be limited.');
    }
  }

  // System message that guides the AI's behavior
  getSystemMessage() {
    return `You are an AI assistant for Lakshmipriya's portfolio. You have access to tools that can fetch specific information about her background, projects, skills, and experience.

Your responses should be:
- Professional yet friendly
- Specific and detailed when using tools
- Structured to help the frontend render appropriate UI components
- Conversational and engaging

Available tools:
- getProfile: Get personal information
- getProjects: Get project details (can filter by technology, recency, etc.)
- getSkills: Get skills and expertise
- getResume: Get resume information
- getContact: Get contact information
- getPresentation: Get presentation details
- getCrazy: Get creative/fun information
- getInternship: Get internship details

Always use the appropriate tool when asked for specific information. Structure your responses to indicate the UI component type the frontend should render.`;
  }

  // Tool definitions for the AI to use
  getTools() {
    return [
      {
        name: 'getProfile',
        description: 'Get personal profile information',
        parameters: {
          type: 'object',
          properties: {
            includeDetails: {
              type: 'boolean',
              description: 'Whether to include detailed information'
            }
          }
        }
      },
      {
        name: 'getProjects',
        description: 'Get project information',
        parameters: {
          type: 'object',
          properties: {
            technology: {
              type: 'string',
              description: 'Filter by specific technology'
            },
            limit: {
              type: 'number',
              description: 'Maximum number of projects to return'
            },
            category: {
              type: 'string',
              description: 'Filter by project category'
            }
          }
        }
      },
      {
        name: 'getSkills',
        description: 'Get skills and expertise information',
        parameters: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by skill category'
            },
            proficiency: {
              type: 'string',
              description: 'Filter by proficiency level'
            }
          }
        }
      },
      {
        name: 'getResume',
        description: 'Get resume information',
        parameters: {
          type: 'object',
          properties: {
            format: {
              type: 'string',
              description: 'Format of resume (summary, detailed, etc.)'
            }
          }
        }
      },
      {
        name: 'getContact',
        description: 'Get contact information',
        parameters: {
          type: 'object',
          properties: {
            method: {
              type: 'string',
              description: 'Contact method (email, phone, social, etc.)'
            }
          }
        }
      },
      {
        name: 'getPresentation',
        description: 'Get presentation details',
        parameters: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              description: 'Presentation topic or category'
            }
          }
        }
      },
      {
        name: 'getCrazy',
        description: 'Get creative or fun information',
        parameters: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Category of creative content'
            }
          }
        }
      },
      {
        name: 'getInternship',
        description: 'Get internship information',
        parameters: {
          type: 'object',
          properties: {
            company: {
              type: 'string',
              description: 'Filter by company'
            },
            duration: {
              type: 'string',
              description: 'Filter by duration'
            }
          }
        }
      }
    ];
  }

  // Execute a specific tool
  async executeTool(toolName, parameters = {}) {
    try {
      switch (toolName) {
        case 'getProfile':
          return await getProfile(parameters);
        case 'getProjects':
          return await getProjects(parameters);
        case 'getSkills':
          return await getSkills(parameters);
        case 'getResume':
          return await getResume(parameters);
        case 'getContact':
          return await getContact(parameters);
        case 'getPresentation':
          return await getPresentation(parameters);
        case 'getCrazy':
          return await getCrazy(parameters);
        case 'getInternship':
          return await getInternship(parameters);
        default:
          throw new Error(`Unknown tool: ${toolName}`);
      }
    } catch (error) {
      console.error(`Error executing tool ${toolName}:`, error);
      throw error;
    }
  }

  // Generate AI response using the configured model
  async generateResponse(userInput, conversationHistory = []) {
    try {
      const messages = [
        { role: 'system', content: this.getSystemMessage() },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userInput }
      ];

      const response = await this.callMistralAPI(messages);
      
      return {
        id: uuidv4(),
        content: response,
        type: 'text',
        timestamp: new Date().toISOString(),
        aiGenerated: true
      };
    } catch (error) {
      console.error('Error generating AI response:', error);
      return this.generateFallbackResponse(userInput);
    }
  }

  // Call Mistral API
  async callMistralAPI(messages) {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const formattedPrompt = this.formatPromptForMistral(messages);
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/${this.model}`,
        {
          inputs: formattedPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data[0]?.generated_text || 'I apologize, but I encountered an error processing your request.';
    } catch (error) {
      console.error('Mistral API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  // Format messages for Mistral
  formatPromptForMistral(messages) {
    let prompt = '';
    
    for (const message of messages) {
      if (message.role === 'system') {
        prompt += `System: ${message.content}\n\n`;
      } else if (message.role === 'user') {
        prompt += `User: ${message.content}\n\n`;
      } else if (message.role === 'assistant') {
        prompt += `Assistant: ${message.content}\n\n`;
      }
    }
    
    prompt += 'Assistant:';
    return prompt;
  }

  // Generate fallback response when AI fails
  generateFallbackResponse(userInput) {
    const fallbackResponses = [
      "I'm having trouble processing that right now. Could you try rephrasing your question?",
      "I'm experiencing some technical difficulties. Please try again in a moment.",
      "I'm not able to respond properly at the moment. Could you ask something else?",
      "I'm having issues with my AI processing. Let me know if you need help with something specific about Lakshmipriya's portfolio."
    ];
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return {
      id: uuidv4(),
      content: randomResponse,
      type: 'text',
      timestamp: new Date().toISOString(),
      aiGenerated: false
    };
  }

  // Stream response for real-time chat
  async *streamResponse(userInput, conversationHistory = []) {
    try {
      const response = await this.generateResponse(userInput, conversationHistory);
      
      // Simulate streaming by yielding characters
      for (let i = 0; i < response.content.length; i++) {
        yield response.content[i];
        // Small delay to simulate real streaming
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    } catch (error) {
      console.error('Error in stream response:', error);
      yield 'I encountered an error while processing your request.';
    }
  }
}

export default new AIServer();
