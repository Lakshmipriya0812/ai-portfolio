# AI Provider Setup

## Quick Setup

1. Copy the environment template:

```bash
cd server
cp env-template.txt .env
```

2. Choose your AI provider and configure `.env` (required).

---

## Supported Providers

| Provider         | Recommended Use         |
| ---------------- | ----------------------- |
| **Gemini**       | Free tier, production   |
| **Ollama**       | Local development       |
| **OpenAI**       | High-volume production  |
| **Anthropic**    | Enterprise              |
| **Hugging Face** | Experimentation/testing |

---

## `.env` Configuration Examples

**Gemini (Recommended for Portfolio)**

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

**Ollama (Local, Private)**

```env
AI_PROVIDER=ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
```

**OpenAI**

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-3.5-turbo
```

**Anthropic**

```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

**Hugging Face**

```env
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=your_key_here
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
```

**Optional server settings:**

```env
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Testing Your Setup

```bash
cd server
npm run dev
curl http://localhost:3001/api/provider-info
```

Expected output:

```json
{
  "success": true,
  "provider": "gemini",
  "model": "gemini-2.0-flash-exp",
  "status": "available"
}
```

---

## Switching Providers

Change `.env`:

```env
AI_PROVIDER=ollama
```

Then restart server:

```bash
npm run dev
```

---

## Fallback Configuration

Primary → Gemini → Ollama → OpenAI → Anthropic

Edit `server/src/config/ai.config.js` to customize:

```javascript
fallbacks: ["gemini", "ollama", "openai"];
```

---

## Production Recommendations

- **Portfolio (30–50 visitors/day)** → Gemini (free, fast)
- **High-traffic (500+ visitors/day)** → OpenAI GPT-3.5 + caching
- **Privacy-focused/local** → Ollama

---

## Rate Limiting & Cost Protection

- 48-hour caching reduces duplicate API calls
- IP-based rate limiting (12 requests/day per IP)
- Monitor usage: `curl http://localhost:3001/api/stats/usage`

---

## Getting Help

- API key issues → Provider docs
- Technical issues → `server/logs`
- Performance issues → [RATE_LIMITING.md](./RATE_LIMITING.md)

---

**Last Updated:** November 2025

---
