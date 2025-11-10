import fetch from "node-fetch";

/**
 * Base AI Provider Interface
 * All providers must implement this interface
 */
export class AIProvider {
  constructor(config) {
    this.config = config;
  }

  /**
   * Generate text response
   * @param {string} prompt - The prompt to send to the AI
   * @returns {Promise<string>} - The generated text
   */
  async generate(prompt) {
    throw new Error("generate() must be implemented by provider");
  }

  /**
   * Check if provider is available/configured
   * @returns {boolean}
   */
  isAvailable() {
    return true;
  }

  /**
   * Get provider name
   * @returns {string}
   */
  getName() {
    return "base";
  }
}

/**
 * Ollama Provider - Local models
 */
export class OllamaProvider extends AIProvider {
  async generate(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.url}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          stream: false,
          options: this.config.options,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || "";
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Ollama request timed out");
      }
      throw error;
    }
  }

  isAvailable() {
    return this.config.url !== undefined;
  }

  getName() {
    return "ollama";
  }
}

/**
 * OpenAI Provider - GPT models
 */
export class OpenAIProvider extends AIProvider {
  async generate(prompt) {
    if (!this.config.apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: "user", content: prompt }],
          temperature: this.config.options.temperature,
          max_tokens: this.config.options.max_tokens,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI error: ${error.error?.message || response.statusText}`
        );
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("OpenAI request timed out");
      }
      throw error;
    }
  }

  isAvailable() {
    return this.config.apiKey !== undefined && this.config.apiKey !== "";
  }

  getName() {
    return "openai";
  }
}

/**
 * Hugging Face Provider - Free inference API
 */
export class HuggingFaceProvider extends AIProvider {
  async generate(prompt) {
    if (!this.config.apiKey) {
      throw new Error("Hugging Face API key not configured");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.url}/${this.config.model}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: this.config.options.temperature,
            max_new_tokens: this.config.options.max_new_tokens,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Hugging Face error: ${response.statusText}`);
      }

      const data = await response.json();
      return data[0]?.generated_text || data.generated_text || "";
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Hugging Face request timed out");
      }
      throw error;
    }
  }

  isAvailable() {
    return this.config.apiKey !== undefined && this.config.apiKey !== "";
  }

  getName() {
    return "huggingface";
  }
}

/**
 * Google Gemini Provider - Gemini models
 */
export class GeminiProvider extends AIProvider {
  async generate(prompt) {
    if (!this.config.apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      // Correct Gemini API endpoint format
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: this.config.options.temperature,
            maxOutputTokens: this.config.options.maxOutputTokens,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini error: ${response.statusText} - ${errorData}`);
      }

      const data = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "";
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Gemini request timed out");
      }
      throw error;
    }
  }

  isAvailable() {
    return this.config.apiKey !== undefined && this.config.apiKey !== "";
  }

  getName() {
    return "gemini";
  }
}

/**
 * Anthropic Claude Provider
 */
export class AnthropicProvider extends AIProvider {
  async generate(prompt) {
    if (!this.config.apiKey) {
      throw new Error("Anthropic API key not configured");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: "user", content: prompt }],
          temperature: this.config.options.temperature,
          max_tokens: this.config.options.max_tokens,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Anthropic error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0]?.text || "";
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Anthropic request timed out");
      }
      throw error;
    }
  }

  isAvailable() {
    return this.config.apiKey !== undefined && this.config.apiKey !== "";
  }

  getName() {
    return "anthropic";
  }
}
