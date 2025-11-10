# AI Provider Setup Guide

## Quick Start

Your portfolio now supports multiple AI providers with **zero code changes**!

## How to Switch AI Providers

### Option 1: Environment Variable (Recommended)

```bash
# In your .env file or terminal:
export AI_PROVIDER=openai
export AI_PROVIDER=huggingface
export AI_PROVIDER=gemini
export AI_PROVIDER=ollama  # Default
```

### Option 2: Config File

Edit `server/src/config/ai.config.js`:

```javascript
provider: 'openai',  // Change this line
```

That's it! The system automatically handles the rest.

---

## Provider Setup Instructions

### 1. Ollama (Local - Default) ✅ FREE FOREVER

**No setup needed - already working!**

- Running on your machine
- No API keys required
- Completely free
- Works offline

**To use faster models:**

```bash
# Pull faster models
docker exec -it ollama ollama pull phi3:mini        # 2.3GB
docker exec -it ollama ollama pull qwen2.5:0.5b     # 400MB
docker exec -it ollama ollama pull tinyllama        # 636MB

# Update .env
OLLAMA_MODEL=phi3:mini
```

---

### 2. Hugging Face (Free Tier) 🆓 1000 REQUESTS/MONTH

**Best for: Free production use**

1. Go to https://huggingface.co
2. Sign up (free)
3. Get API token: https://huggingface.co/settings/tokens
4. Add to `.env`:

```bash
AI_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_your_key_here
```

**Recommended models:**

- `microsoft/DialoGPT-medium` (conversational)
- `facebook/blenderbot-400M-distill` (fast)
- `meta-llama/Llama-2-7b-chat-hf` (powerful)

---

### 3. Google Gemini (Free Tier) 🆓 1M TOKENS/DAY

**Best for: High volume free usage**

1. Go to https://aistudio.google.com
2. Sign in with Google
3. Get API key (no credit card required!)
4. Add to `.env`:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

**Free limits:**

- 15 requests per minute
- 1 million tokens per day
- Perfect for personal portfolios!

---

### 4. OpenAI (Paid - Best Quality) 💰 ~$0.75/1000 QUESTIONS

**Best for: Production with best quality**

1. Go to https://platform.openai.com
2. Sign up (get $5 free credits)
3. Create API key
4. Add to `.env`:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=gpt-3.5-turbo  # Cheapest & fast
```

**Costs:**

- GPT-3.5-turbo: $0.0015/1K tokens (~$0.75 for 1000 portfolio questions)
- GPT-4: $0.03/1K tokens (more expensive but better)

---

### 5. Anthropic Claude (Paid) 💰

**Best for: Long context, careful reasoning**

1. Go to https://console.anthropic.com
2. Sign up and add payment
3. Get API key
4. Add to `.env`:

```bash
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

---

## Performance Comparison

| Provider           | Speed     | Cost   | Quality   | Best For             |
| ------------------ | --------- | ------ | --------- | -------------------- |
| **Ollama (local)** | Medium    | Free   | Good      | Development, offline |
| **Hugging Face**   | Fast      | Free\* | Good      | Production (1000/mo) |
| **Gemini**         | Very Fast | Free\* | Great     | High-volume free     |
| **OpenAI**         | Fast      | Low    | Excellent | Best quality needed  |
| **Claude**         | Medium    | Medium | Excellent | Long conversations   |

\*Free tier limitations apply

---

## Fallback System

The system automatically tries fallback providers if primary fails:

```javascript
// In ai.config.js
fallbacks: ["ollama", "huggingface"];
```

Order of attempts:

1. Your chosen provider
2. First fallback
3. Second fallback
4. Error only if all fail

---

## Testing Different Providers

```bash
# Test Ollama (local)
AI_PROVIDER=ollama npm run dev

# Test Hugging Face
AI_PROVIDER=huggingface npm run dev

# Test Gemini
AI_PROVIDER=gemini npm run dev
```

---

## Monitoring

Watch console output:

```
✅ AI Provider: ollama (llama3.2:1b)
🤖 Generating with ollama...
✅ Generated in 12.5s
```

If primary fails:

```
❌ ollama failed: timeout
🔄 Trying fallback: huggingface
✅ Fallback huggingface succeeded
```

---

## Recommendation for Your Portfolio

**For Development:**

- Use **Ollama** with `phi3:mini` (fast, free, offline)

**For Production (Free):**

- Primary: **Gemini** (1M tokens/day free)
- Fallback: **Hugging Face** (1000/month free)

**For Production (Paid - Best Quality):**

- Use **OpenAI GPT-3.5-turbo** (~$0.75/1000 questions)

---

## Quick Commands

```bash
# Switch providers instantly
export AI_PROVIDER=gemini && npm run dev

# View current provider
curl http://localhost:3001/api/provider-info

# Test generation
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about yourself"}'
```

---

## Need Help?

The system will automatically:

- ✅ Select configured provider
- ✅ Fall back if it fails
- ✅ Log clear error messages
- ✅ Handle timeouts gracefully

Just set `AI_PROVIDER` and the API key (if needed). Everything else is automatic!
