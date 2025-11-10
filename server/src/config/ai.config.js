// Load environment variables
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

// AI Configuration - Change provider and model here

// Debug: Log environment variables when config is loaded
console.log("🔧 Loading AI Config...");
console.log("AI_PROVIDER:", process.env.AI_PROVIDER);
console.log(
  "GEMINI_API_KEY:",
  process.env.GEMINI_API_KEY
    ? `Set (${process.env.GEMINI_API_KEY.substring(0, 10)}...)`
    : "NOT SET"
);

export const AI_CONFIG = {
  // Active provider: 'ollama' | 'openai' | 'huggingface' | 'gemini' | 'anthropic'
  provider: process.env.AI_PROVIDER || "gemini",

  // Fallback providers (in order of priority)
  fallbacks: ["ollama", "huggingface"],

  // Provider-specific settings
  providers: {
    ollama: {
      url: process.env.OLLAMA_URL || "http://localhost:11434",
      model: process.env.OLLAMA_MODEL || "llama3.2:1b",
      timeout: 30000,
      options: {
        temperature: 0.8,
        top_p: 0.9,
        num_predict: 800, // Increased for longer responses
      },
    },

    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      url: "https://api.openai.com/v1/chat/completions",
      timeout: 30000,
      options: {
        temperature: 0.8,
        max_tokens: 200,
      },
    },

    huggingface: {
      apiKey: process.env.HUGGINGFACE_API_KEY,
      model: process.env.HUGGINGFACE_MODEL || "microsoft/DialoGPT-medium",
      url: "https://api-inference.huggingface.co/models",
      timeout: 30000,
      options: {
        temperature: 0.8,
        max_new_tokens: 200,
      },
    },

    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash-exp",
      url: "https://generativelanguage.googleapis.com/v1beta/models",
      timeout: 30000,
      options: {
        temperature: 0.8,
        maxOutputTokens: 800, // Increased for longer responses
      },
    },

    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307",
      url: "https://api.anthropic.com/v1/messages",
      timeout: 30000,
      options: {
        temperature: 0.8,
        max_tokens: 200,
      },
    },
  },
};
