/**
 * AI Text Generation - Unified Interface
 *
 * This file provides a clean abstraction over multiple AI providers.
 * To change AI provider or model, update: server/src/config/ai.config.js
 *
 * Supported Providers:
 * - Ollama (local models) - Default
 * - OpenAI (GPT-3.5, GPT-4)
 * - Hugging Face (free tier)
 * - Google Gemini
 * - Anthropic Claude
 */

import { generateText as generate } from "./aiService.js";
import { trackAPICall } from "./usageTracker.js";

/**
 * Generate text using configured AI provider
 * @param {string} prompt - The prompt to send to AI
 * @returns {Promise<string>} - Generated text response
 */
export async function generateText(prompt) {
  try {
    trackAPICall(); // Track API usage
    const response = await generate(prompt);
    return response || "";
  } catch (error) {
    console.error("AI generation error:", error.message);
    return "I'm having trouble generating a response right now. Please try again in a moment.";
  }
}
