import fetch from "node-fetch";

const OLLAMA_BASE_URL = "http://localhost:11434/api/generate";
const MODEL = "deepseek-r1:1.5b";

export async function generateText(prompt) {
  try {
    const response = await fetch(OLLAMA_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        max_tokens: 100,
      }),
    });

    if (!response.ok) throw new Error(`Ollama generation error: ${response.statusText}`);
    const text = await response.text();
    const lines = text.split("\n");
    const output = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line);
        if (json.response) output.push(json.response);
      } catch {
      }
    }

    return output.join("").trim();
  } catch (error) {
    console.error("Error generating text:", error);
    return "";
  }
}