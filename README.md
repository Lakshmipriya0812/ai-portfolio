# AI Portfolio — Lakshmipriya

A lightweight AI-powered portfolio with a conversational interface for showcasing projects, skills, experience, and contact details.  
Built with **React + TypeScript (Vite)** frontend and **Node.js Express** backend supporting AI-powered chat and embeddings.

---

## Features

- Modern, responsive frontend with React + Vite
- Conversational chat UI with quick-action prompts
- Node.js Express backend for ingestion and chat proxy
- Reusable components, Framer Motion animations, and simple hooks
- Supports multiple AI providers: Gemini, Ollama, OpenAI, Anthropic, Hugging Face

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Steps

1. Clone the repository:

```bash
git clone URL
cd ai-portfolio
```

````

2. Install dependencies:

```bash
cd client && npm install
cd ../server && npm install
```

3. Configure AI provider:

```bash
cd server
cp env-template.txt .env
# Edit .env with your AI provider credentials
```

4. Start development servers:

```bash
# Frontend
cd client && npm run dev # opens at http://localhost:5173

# Backend (separate terminal)
cd server && npm run dev # listens on http://localhost:3001
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The frontend will connect automatically to the backend API.

---

## Production (Optional)

- The project includes a **Dockerfile** for building the app.
- Deploy with **Fly.io** or another Docker-supported platform.
- Ensure environment variables are set via your platform’s secret management.

---

## Contributing

- Create a feature branch from `main`
- Open a pull request describing your changes
- Keep changes small and focused: frontend, backend, or AI logic

---

## License

MIT License — see `LICENSE` file.

---

## Contact

**Author:** Lakshmipriya

## Discussion

For questions, suggestions, or setup tips, please use the [GitHub Discussions](https://github.com/Lakshmipriya0812/ai-portfolio/discussions) section.
````
