import fs from "fs";
import path from "path";
import { getEmbedding } from "../lib/embeddings.js";
import { getSection } from "./sectionControllers.js";

// Load full index (documents + vectors)
const indexPath = path.join(process.cwd(), "storage", "indexStore.json");
const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
const vectorsMap = new Map(indexData.vectors.map((v) => [v.id, v.embedding]));

// ---------------- Helper: cosine similarity ----------------
function cosineSim(vecA, vecB) {
  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB + 1e-10);
}

// ---------------- Keyword Bias Rules ----------------
const keywordBias = {
  about: [
    "yourself",
    "who are you",
    "intro",
    "introduction",
    "background",
    "profile",
  ],
  skills: [
    "skills",
    "technologies",
    "tools",
    "expertise",
    "strengths",
    "tech stacks",
  ],
  projects: [
    "projects",
    "portfolio",
    "applications",
    "apps",
    "worked on",
    "built",
  ],
  experience: ["experience", "work history", "career", "roles", "jobs"],
  fun: ["fun", "hobbies", "interests", "free time", "hobby"],
  contact: ["contact", "email", "phone", "linkedin", "github"],
};

function detectKeywordBias(message) {
  const lowerMsg = message.toLowerCase();
  for (const [section, keywords] of Object.entries(keywordBias)) {
    if (keywords.some((k) => lowerMsg.includes(k))) {
      return section;
    }
  }
  return null;
}

// ---------------- Chat Handler ----------------
export async function chatHandler(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    const queryEmbedding = await getEmbedding(message);
    if (!queryEmbedding)
      return res.status(400).json({ error: "Failed to generate embedding" });

    const scoredDocs = indexData.documents
      .map((doc) => {
        const emb = vectorsMap.get(doc.id);
        if (!emb) return null;
        return {
          section: doc.metadata.section,
          id: doc.id,
          score: cosineSim(queryEmbedding, emb),
        };
      })
      .filter(Boolean);

    scoredDocs.sort((a, b) => b.score - a.score);
    let bestDoc = scoredDocs[0];
    let secondBest = scoredDocs[1] || { score: 0 };

    const keywordSection = detectKeywordBias(message);
    if (keywordSection) {
      bestDoc.section = keywordSection;
      if (process.env.NODE_ENV === "development") {
        console.log(`Keyword detected: ${keywordSection}`);
      }
    } else {
      const margin = bestDoc.score - secondBest.score;
      if (margin < 0.02) {
        bestDoc.section = "about";
        if (process.env.NODE_ENV === "development") {
          console.log(
            `Low confidence (margin: ${margin.toFixed(4)}), defaulting to about`
          );
        }
      }
    }

    if (!bestDoc)
      return res.status(404).json({ error: "No matching section found" });

    const fakeReq = { params: { section: bestDoc.section } };
    const fakeRes = {
      json: (data) => {
        res.json({ section: bestDoc.section, ...data });
      },
      status: (code) => ({ json: (data) => res.status(code).json(data) }),
    };

    await getSection(fakeReq, fakeRes);
  } catch (err) {
    console.error(`Chat handler error:`, err.message);
    res.status(500).json({
      error: "Failed to process chat message",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
