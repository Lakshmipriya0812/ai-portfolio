import fetch from "node-fetch";

const OLLAMA_BASE_URL = "http://localhost:11434/api/embeddings";
const MODEL = "nomic-embed-text";

export async function getEmbedding(text) {
  try {
    if (!text || text.trim() === "") return null;
    const response = await fetch(OLLAMA_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embedding error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}
