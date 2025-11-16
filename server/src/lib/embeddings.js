import fetch from "node-fetch";
import { aiService } from "../services/AIService.js";

const isLocal = process.env.NODE_ENV !== "production";

const OLLAMA_BASE_URL = process.env.OLLAMA_URL
  ? `${process.env.OLLAMA_URL}/api/embeddings`
  : "http://localhost:11434/api/embeddings";
const OLLAMA_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";

/**
 * Generate embeddings for a given text
 * Uses Ollama locally, Gemini (or active AI provider) in production
 */
export async function getEmbedding(text) {
  if (!text || !text.trim()) return null;

  try {
    if (isLocal) {
      // === LOCAL: Ollama ===
      const response = await fetch(OLLAMA_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama embedding error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding;
    } else {
      // === PRODUCTION: Use Gemini / AIService ===
      // Assumes aiService.generate() can return embeddings in production
      const embeddingResponse = await aiService.generate(text);

      // Depending on your Gemini setup, you may get an array directly
      return embeddingResponse.embedding || embeddingResponse;
    }
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}
