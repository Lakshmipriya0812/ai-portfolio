import fs from "fs";
import path from "path";
import { getEmbedding } from "../lib/embeddings.js";

const knowledgePath = path.join(process.cwd(), "data", "knowledge.json");
const indexStorePath = path.join(process.cwd(), "storage", "indexStore.json");

async function addDocument(index, id, type, title, content, metadata = {}) {
  if (!content || !content.trim()) return;
  const embedding = await getEmbedding(content);
  if (!embedding) return;
  index.documents.push({ id, type, title, content, metadata });
  index.vectors.push({ id, embedding });
}

export async function ingestData() {
  console.log("Starting ingestion...");

  const rawData = fs.readFileSync(knowledgePath, "utf-8");
  const knowledge = JSON.parse(rawData);

  const index = { documents: [], vectors: [] };

  if (knowledge.about) {
    await addDocument(
      index,
      "about:main",
      "about",
      knowledge.about.title,
      knowledge.about.content,
      { section: "about" }
    );
  }

  if (knowledge.skills?.categories) {
    for (const cat of knowledge.skills.categories) {
      const content = cat.items.join(", ");
      const docId = `skills:${cat.title.toLowerCase().replace(/\s+/g, "_")}`;
      await addDocument(index, docId, "skills", cat.title, content, {
        section: "skills",
        category: cat.title,
        items: cat.items,
      });
    }
  }

  if (knowledge.education) {
    await addDocument(
      index,
      "education:main",
      "education",
      knowledge.education.title,
      knowledge.education.content,
      { section: "education" }
    );
  }

  if (knowledge.fun) {
    await addDocument(
      index,
      "fun:main",
      "fun",
      knowledge.fun.title,
      knowledge.fun.content,
      { section: "fun" }
    );
  }

  if (knowledge.experience?.positions) {
    for (let i = 0; i < knowledge.experience.positions.length; i++) {
      const pos = knowledge.experience.positions[i];
      const content = `${pos.role} at ${pos.company}, ${pos.period}, ${pos.location}. Highlights: ${pos.highlights.join("; ")}`;
      await addDocument(index, `experience:${i}`, "experience", pos.role, content, {
        section: "experience",
        ...pos,
      });
    }
  }

  if (knowledge.projects?.items) {
    await Promise.all(
      knowledge.projects.items.map((proj, i) => {
        const content = `${proj.name} - Technologies: ${proj.technologies.join(", ")}. Highlights: ${proj.highlights.join("; ")}`;
        return addDocument(index, `project:${i}`, "project", proj.name, content, {
          section: "projects",
          ...proj,
        });
      })
    );
  }

  if (knowledge.contact?.details) {
    const content = `Email: ${knowledge.contact.details.email}, Phone: ${knowledge.contact.details.phone}, LinkedIn: ${knowledge.contact.details.LinkedIn}, GitHub: ${knowledge.contact.details.GitHub}`;
    await addDocument(index, "contact:main", "contact", knowledge.contact.title, content, {
      section: "contact",
      ...knowledge.contact.details,
    });
  }

  fs.writeFileSync(indexStorePath, JSON.stringify(index, null, 2));
  console.log(`Ingestion complete. ${index.documents.length} documents indexed.`);

  return { success: true, totalDocuments: index.documents.length };
}

if (process.argv[1].endsWith("ingest.js")) {
  ingestData();
}

export default ingestData;
