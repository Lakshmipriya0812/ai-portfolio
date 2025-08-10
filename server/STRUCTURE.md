# Server Structure

This server follows a clean, modular architecture for better maintainability and organization.

## Directory Structure

```
server/
├── src/
│   ├── routes/
│   │   ├── chat.js                # POST /chat (AI endpoint)
│   │   └── portfolio.js           # Portfolio data endpoints
│   ├── services/
│   │   ├── aiServer.js            # AI SDK setup, tools, model configuration
│   │   ├── portfolioData.js       # Static portfolio information
│   │   └── tools/                 # Individual AI tool implementations
│   │       ├── getProfile.js      # Profile information tool
│   │       ├── getProjects.js     # Projects information tool
│   │       ├── getSkills.js       # Skills information tool
│   │       ├── getResume.js       # Resume information tool
│   │       ├── getContact.js      # Contact information tool
│   │       ├── getPresentation.js # Presentation information tool
│   │       ├── getCrazy.js        # Creative/fun information tool
│   │       └── getInternship.js   # Internship information tool
│   ├── middleware/                 # Express middleware
│   └── index.js                   # Server entry point
├── package.json
└── env.example
```

## Key Components

### 1. AI Server (`aiServer.js`)
- Central AI service that manages the Mistral model integration
- Defines all available tools and their parameters
- Handles AI response generation and streaming
- Manages system messages and tool execution

### 2. Tools (`tools/`)
Each tool is a separate module that:
- Handles specific data requests
- Provides consistent response format
- Includes error handling
- Can be easily extended or modified

### 3. Portfolio Data (`portfolioData.js`)
- Centralized data store for all portfolio information
- Exports data and utility functions
- Clean separation of data and logic

### 4. Routes (`routes/`)
- Clean API endpoints
- Separation of concerns
- Easy to maintain and extend

## Benefits of This Structure

1. **Modularity**: Each tool is independent and can be modified without affecting others
2. **Maintainability**: Clear separation of concerns makes code easier to understand
3. **Scalability**: Easy to add new tools or modify existing ones
4. **Testing**: Individual components can be tested in isolation
5. **Documentation**: Clear structure makes it easier for new developers to understand

## Adding New Tools

To add a new tool:

1. Create a new file in `services/tools/`
2. Export an async function with the tool name
3. Add tool definition to `aiServer.js` getTools() method
4. Add tool execution case in `aiServer.js` executeTool() method
5. Import the tool in `aiServer.js`

## Example Tool Structure

```javascript
// services/tools/getExample.js
export async function getExample(parameters = {}) {
  try {
    // Tool logic here
    return {
      success: true,
      data: result,
      type: 'example',
      message: 'Success message'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error message',
      type: 'error'
    };
  }
}
```
