# AI Portfolio — Lakshmipriya

A lightweight, AI-powered portfolio and conversational interface for showcasing projects, skills, experience, and contact details. This repository contains a React + TypeScript frontend (Vite) and a Node.js Express backend that supports ingestion, simple embeddings, and chat-style interactions powered by an API layer.

This README provides a concise, professional guide to running, developing, and deploying the project.

---

## Highlights

- Modern, responsive frontend built with React, TypeScript and Vite
- Conversational chat UI with quick-action prompts and a searchable knowledge base
- Node.js Express backend for ingesting and serving knowledge/embeddings
- Clean component structure and simple hooks for chat and home interactions

---

## Features

- Interactive chat with typed / quick-action prompts
- Reusable QuickActions component used across pages (home, chat)
- Expandable, animated UI elements using Framer Motion
- Simple server-side endpoints for ingestion and chat proxying

---

## Quick start (development)

Prerequisites:

- Node.js 18+ (or supported LTS)
- npm or yarn

1. Install dependencies for both client and server

```bash
# from repo root
cd client && npm install
cd ../server && npm install
```

2. Configure AI Provider (Backend)

Create a `.env` file in the `server` directory and configure your preferred AI provider:

```bash
cd server
cp env-template.txt .env
# Edit .env with your AI provider credentials
```

> 📖 **See [AI_SETUP.md](./AI_SETUP.md) for detailed AI provider configuration guide**
>
> Including setup instructions for Gemini, Ollama, OpenAI, Anthropic, and Hugging Face.

3. Start the development servers

```bash
# Run frontend dev server
cd client && npm run dev

# In a separate terminal, run backend server
cd server && npm run dev
```

Open the frontend (Vite dev URL printed in terminal, typically http://localhost:5173) and the app should connect to the backend API endpoints.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Create a feature branch from `main` as appropriate
2. Open a pull request describing changes and expected behavior
3. Keep changes small and focused (UI, behavior, or server enhancements)

If you want, I can add a few starter tests and a basic GitHub Actions workflow for CI.

---

## License

This project is released under the MIT License. See the `LICENSE` file for details.

---

## Contact

Author: Lakshmipriya

If you want help customizing the UI, integrating a different model provider, or adding tests, tell me what to improve and I can implement it.
