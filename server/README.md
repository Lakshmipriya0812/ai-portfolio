# AI Portfolio Backend

A powerful backend server for an AI-powered portfolio that integrates with Mistral LLM through Hugging Face, providing tool-augmented responses with server-side streaming.

## Features

- 🤖 **AI Integration**: Connects with Mistral-7B-Instruct model via Hugging Face API
- 🛠️ **Tool-Augmented Responses**: AI can call custom backend functions to fetch specific portfolio data
- 📡 **Server-Side Streaming**: Real-time streaming responses for enhanced user experience
- 🔒 **Security**: Comprehensive security middleware including CORS, rate limiting, and input validation
- 📊 **Portfolio Data**: Rich API endpoints for accessing portfolio information
- 🚀 **Performance**: Optimized with compression, caching, and efficient error handling

## Architecture

The backend follows a modular architecture with:

- **AI Service**: Core LLM integration and tool orchestration
- **Portfolio Service**: Data management and business logic
- **API Routes**: RESTful endpoints for chat and portfolio data
- **Middleware**: Security, validation, and error handling
- **Tool System**: Extensible tool framework for AI responses

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Hugging Face API key

### Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure your environment variables in `.env`:
```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
PORT=3001
NODE_ENV=development
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Chat Endpoints

#### POST `/api/chat`
Send a message and get AI response.

**Request Body:**
```json
{
  "message": "Tell me about your projects",
  "conversationId": "optional-uuid",
  "stream": false
}
```

**Response:**
```json
{
  "success": true,
  "conversationId": "uuid",
  "response": {
    "id": "response-uuid",
    "content": "I have several exciting projects...",
    "type": "project-grid",
    "data": [...],
    "timestamp": "2024-01-01T00:00:00.000Z",
    "aiGenerated": true
  }
}
```

#### POST `/api/chat/stream`
Streaming chat endpoint for real-time responses.

**Request Body:**
```json
{
  "message": "What are your skills?",
  "conversationId": "optional-uuid"
}
```

**Response:** Server-Sent Events stream with chunks:
```
data: {"type":"token","content":"I have ","isComplete":false}

data: {"type":"token","content":"expertise in ","isComplete":false}

data: {"type":"complete","content":"I have expertise in React, TypeScript...","isComplete":true}
```

#### GET `/api/chat/conversation/:id`
Get conversation history.

#### GET `/api/chat/conversations`
List all conversations.

#### DELETE `/api/chat/conversation/:id`
Delete a conversation.

### Portfolio Endpoints

#### GET `/api/portfolio`
Get all portfolio data.

#### GET `/api/portfolio/profile`
Get profile information.

#### GET `/api/portfolio/projects`
Get projects with optional filters.

**Query Parameters:**
- `technology`: Filter by technology
- `limit`: Limit number of results
- `category`: Filter by category

#### GET `/api/portfolio/skills`
Get skills with optional filters.

**Query Parameters:**
- `category`: Filter by skill category
- `proficiency`: Filter by proficiency level

#### GET `/api/portfolio/experience`
Get work experience with optional filters.

#### GET `/api/portfolio/search?q=query`
Search across all portfolio data.

#### GET `/api/portfolio/technologies`
Get all unique technologies.

#### GET `/api/portfolio/stats`
Get portfolio statistics.

## AI Tool System

The AI service can call various tools to provide structured responses:

### Available Tools

- **`getProfile`**: Retrieve personal information
- **`getProjects`**: Fetch project details with filtering
- **`getSkills`**: Get skills and expertise
- **`getExperience`**: Retrieve work experience
- **`getContact`**: Get contact information

### Tool Response Types

The AI returns responses with specific types that the frontend can use to render appropriate UI components:

- `profile-card`: Personal profile information
- `project-grid`: Project listings
- `skills-list`: Skills and expertise
- `experience-timeline`: Work experience
- `contact-info`: Contact details
- `text`: General text response

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | Required |
| `MISTRAL_MODEL` | Mistral model to use | `mistralai/Mistral-7B-Instruct-v0.2` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `localhost:3000,5173` |

### Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address
- Configurable via environment variables

## Development

### Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Project Structure

```
server/
├── src/
│   ├── index.js              # Main server file
│   ├── routes/               # API route handlers
│   │   ├── chat.js          # Chat endpoints
│   │   └── portfolio.js     # Portfolio endpoints
│   ├── services/             # Business logic
│   │   ├── aiService.js     # AI integration
│   │   └── portfolioData.js # Portfolio data
│   └── middleware/           # Express middleware
│       ├── errorHandler.js   # Error handling
│       └── validation.js     # Request validation
├── package.json
├── env.example
└── README.md
```

### Adding New Tools

To extend the AI tool system:

1. Add tool definition in `aiService.js`:
```javascript
{
  name: 'getNewTool',
  description: 'Description of what the tool does',
  parameters: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Parameter description' }
    }
  }
}
```

2. Implement tool execution in `executeTool` method:
```javascript
case 'getNewTool':
  return {
    type: 'new-component-type',
    data: resultData,
    message: 'Tool response message'
  };
```

3. Update tool selection logic in `analyzeAndExecuteTools` method.

## Security Features

- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi-based request validation
- **Input Sanitization**: Removes potentially harmful content
- **Helmet**: Security headers and CSP
- **Error Handling**: Secure error responses

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production CORS origins
3. Set secure JWT and session secrets
4. Configure production database (if applicable)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Performance Optimization

- Enable compression middleware
- Implement caching strategies
- Use production-grade database
- Monitor API performance
- Implement proper logging

## Troubleshooting

### Common Issues

1. **Hugging Face API Errors**
   - Verify API key is correct
   - Check API rate limits
   - Ensure model name is valid

2. **CORS Errors**
   - Verify `ALLOWED_ORIGINS` configuration
   - Check frontend origin matches

3. **Rate Limiting**
   - Check request frequency
   - Adjust rate limit settings if needed

### Debug Mode

Set `NODE_ENV=development` for detailed error logging and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue or contact the development team.
