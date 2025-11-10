# AI Provider Setup Guide

This guide covers how to configure different AI providers for your portfolio backend.

## Quick Setup

1. Copy the environment template:

```bash
cd server
cp env-template.txt .env
```

2. Choose your AI provider and follow the configuration below.

---

## Supported AI Providers

| Provider         | Cost           | Speed         | Setup Difficulty | Recommended For          |
| ---------------- | -------------- | ------------- | ---------------- | ------------------------ |
| **Gemini**       | Free (50/day)  | Fast (~20s)   | Easy             | Production (recommended) |
| **Ollama**       | Free           | Slower (~80s) | Medium           | Local development        |
| **OpenAI**       | Paid           | Fast          | Easy             | High-volume production   |
| **Anthropic**    | Paid           | Fast          | Easy             | Enterprise               |
| **Hugging Face** | Free (1000/mo) | Variable      | Easy             | Experimentation          |

---

## Option 1: Google Gemini (Recommended)

**Best for**: Production deployment with free tier

### Setup Steps

1. **Get API Key**

   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Configure `.env`**

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

3. **Limits & Features**

   - ✅ Free: 50 requests per day
   - ✅ 1M tokens per day
   - ✅ Fast: ~20 second responses
   - ✅ No credit card required
   - ✅ Great for portfolios (30-45 visitors/day)

4. **Rate Limiting Protection**
   - Built-in 48-hour caching (reduces API calls by 70-80%)
   - IP-based rate limiting (12 requests/day per visitor)
   - Automatic usage monitoring

---

## Option 2: Ollama (Local)

**Best for**: Local development without API costs

### Setup Steps

1. **Install Ollama**

   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.com/install.sh | sh

   # Windows
   # Download from: https://ollama.com/download
   ```

2. **Pull a Model**

   ```bash
   # Lightweight model (recommended)
   ollama pull llama3.2:1b

   # OR larger model (better quality, slower)
   ollama pull llama3.2:3b
   ```

3. **Start Ollama Server**

   ```bash
   ollama serve
   # Keep this terminal running
   ```

4. **Configure `.env`**

   ```env
   AI_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2:1b
   ```

5. **Limits & Features**
   - ✅ Completely free
   - ✅ No API key needed
   - ✅ Full privacy (data stays local)
   - ⚠️ Slower: ~80 seconds per response
   - ⚠️ Requires local resources (RAM/CPU)

---

## Option 3: OpenAI (GPT)

**Best for**: High-volume production with budget

### Setup Steps

1. **Get API Key**

   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create account (new users get $5 free credits)
   - Generate API key

2. **Configure `.env`**

   ```env
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-proj-...your_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

3. **Pricing**

   - gpt-3.5-turbo: $0.0015 per 1K tokens (~$0.002 per request)
   - gpt-4: $0.03 per 1K tokens (~$0.06 per request)
   - Estimated: ~$0.10-0.30/day for portfolio (50 requests)

4. **Limits**
   - 3,500 requests per minute (tier 1)
   - Requires payment method after free credits

---

## Option 4: Anthropic Claude

**Best for**: Enterprise applications

### Setup Steps

1. **Get API Key**

   - Visit [Anthropic Console](https://console.anthropic.com)
   - Create account
   - Generate API key

2. **Configure `.env`**

   ```env
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-...your_key_here
   ANTHROPIC_MODEL=claude-3-haiku-20240307
   ```

3. **Pricing**

   - Claude 3 Haiku: $0.25 per 1M input tokens
   - Claude 3 Sonnet: $3 per 1M input tokens
   - Estimated: ~$0.15-0.40/day for portfolio

4. **Features**
   - Excellent reasoning
   - 200K context window
   - Strong safety features

---

## Option 5: Hugging Face

**Best for**: Experimentation and testing

### Setup Steps

1. **Get API Key**

   - Visit [Hugging Face Settings](https://huggingface.co/settings/tokens)
   - Create account
   - Generate "Read" token

2. **Configure `.env`**

   ```env
   AI_PROVIDER=huggingface
   HUGGINGFACE_API_KEY=hf_...your_key_here
   HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
   ```

3. **Limits**
   - Free: 1,000 requests per month
   - Rate limited during high traffic
   - Variable response quality

---

## Testing Your Setup

1. **Start the backend**

   ```bash
   cd server
   npm run dev
   ```

2. **Check provider status**

   ```bash
   curl http://localhost:3001/api/provider-info
   ```

3. **Expected output**

   ```json
   {
     "success": true,
     "provider": "gemini",
     "model": "gemini-2.0-flash-exp",
     "status": "available"
   }
   ```

4. **Test a query**
   - Start frontend: `cd client && npm run dev`
   - Open `http://localhost:5173`
   - Ask a question: "Tell me about your skills"
   - Response should appear in ~20 seconds (Gemini) or ~80 seconds (Ollama)

---

## Switching Providers

You can switch providers anytime by changing `AI_PROVIDER` in `.env`:

```env
# Switch from Gemini to Ollama
AI_PROVIDER=ollama
```

Then restart the server:

```bash
# Ctrl+C to stop server
npm run dev
```

The system automatically detects the active provider and uses configured fallbacks if primary fails.

---

## Fallback Configuration

The system tries providers in this order if primary fails:

1. Primary provider (set in `AI_PROVIDER`)
2. Gemini (if configured)
3. Ollama (if running)
4. OpenAI (if configured)
5. Anthropic (if configured)

To customize fallback order, edit `server/src/config/ai.config.js`:

```javascript
fallbacks: ["gemini", "ollama", "openai"];
```

---

## Troubleshooting

### "No AI provider available"

- Check that API key is correctly set in `.env`
- Verify API key is valid (not expired)
- For Ollama: ensure `ollama serve` is running

### "Rate limit exceeded"

- You've hit the provider's daily/monthly limit
- Wait for reset time or switch to different provider
- Check `/api/stats/usage` for usage statistics

### Slow responses (>60 seconds)

- Ollama: Normal for local models, use Gemini for faster responses
- Gemini/OpenAI: Check internet connection
- Check backend logs for errors

### "Failed to generate embedding"

- Restart Ollama server
- Check that model is downloaded: `ollama list`
- Try re-pulling model: `ollama pull llama3.2:1b`

---

## Environment Variables Reference

### Required (choose one provider)

```env
AI_PROVIDER=gemini|ollama|openai|anthropic|huggingface
```

### Provider-specific

```env
# Gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp

# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b

# OpenAI
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-3.5-turbo

# Anthropic
ANTHROPIC_API_KEY=your_key
ANTHROPIC_MODEL=claude-3-haiku-20240307

# Hugging Face
HUGGINGFACE_API_KEY=your_key
HUGGINGFACE_MODEL=microsoft/DialoGPT-medium
```

### Optional Server Settings

```env
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Production Recommendations

### For Personal Portfolio (30-50 visitors/day)

**Use: Gemini Free Tier**

- Pros: Free, fast, reliable, sufficient quota
- Cost: $0/month
- Setup: 5 minutes

### For High-Traffic Site (500+ visitors/day)

**Use: OpenAI GPT-3.5-Turbo + Aggressive Caching**

- Pros: Fast, scalable, reliable
- Cost: ~$5-15/month
- Setup: 10 minutes

### For Privacy-Focused Application

**Use: Ollama (Local)**

- Pros: Complete data privacy, no external API calls
- Cost: $0/month (hardware only)
- Setup: 20 minutes

---

## Rate Limiting & Cost Protection

The system includes built-in protection:

1. **48-hour Response Caching**

   - Reduces duplicate API calls by 70-80%
   - Covers common questions across multiple visitors

2. **IP-Based Rate Limiting**

   - 12 requests per 24 hours per IP
   - Prevents abuse from single users

3. **Usage Monitoring**
   - Check stats: `curl http://localhost:3001/api/stats/usage`
   - Monitor cache efficiency and API call counts

See [RATE_LIMITING.md](./RATE_LIMITING.md) for detailed protection system documentation.

---

## Getting Help

- **API Key Issues**: Check provider documentation links above
- **Technical Issues**: Review `server/logs` for error messages
- **Performance Issues**: See [RATE_LIMITING.md](./RATE_LIMITING.md) for optimization tips
- **Questions**: Open an issue on GitHub

---

**Last Updated**: November 2025
