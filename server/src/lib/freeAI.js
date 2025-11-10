// Multi-provider AI service with free tiers
const AI_PROVIDERS = {
  huggingface: {
    url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
    free: true,
    limit: 1000 // per month
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    free: false,
    cost: 0.001 // per 1k tokens
  },
  local: {
    url: 'http://localhost:11434/api/generate',
    model: 'phi3:mini',
    free: true,
    unlimited: true
  }
};

export async function generateWithFallback(prompt) {
  // Try free Hugging Face first
  try {
    return await callHuggingFace(prompt);
  } catch (error) {
    console.log('HF failed, trying local...');
    return await callLocal(prompt);
  }
}