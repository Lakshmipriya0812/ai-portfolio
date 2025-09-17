import fs from "fs";
import path from "path";
import { generateText } from "../lib/generation.js";


const indexPath = path.join(process.cwd(), "storage", "indexStore.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

// ---------------- Helper function ----------------
function cleanAIResponse(aiResponse) {
  if (!aiResponse) return "";
  return aiResponse.includes("</think>")
    ? aiResponse.split("</think>").pop().trim()
    : aiResponse.trim();
}

// ---------------- Controller ----------------
export async function getSection(req, res) {
  const { section } = req.params;
  const myName = "Lakshmipriya";


  try {
    switch (section) {
      case "about": {
        const doc = index.documents.find(d => d.metadata.section === "about");
        const prompt = `Write a 4-5 line friendly, enthusiastic introduction using this content: ${doc.content}.
        Start the text with: "Hello, I'm ${myName}."
        Add greeting and emoji.`;

        const aiTextRaw = await generateText(prompt);
        const aiText = cleanAIResponse(aiTextRaw);

        return res.json({ structured: doc, aiText });
      }

      case "fun": {
        const doc = index.documents.find(d => d.metadata.section === "fun");
        const prompt = `Write a 4-5 line friendly, enthusiastic text using this content: "${doc.content}".
        Start the text with: "Hello, I'm ${myName}."
        Do not change the name.
        Add emojis where appropriate.`;
        
        const aiTextRaw = await generateText(prompt);
        const aiText = cleanAIResponse(aiTextRaw);

        return res.json({ structured: doc, aiText });
      }

      case "projects": {
        const docs = index.documents.filter(d => d.metadata.section === section);
        const highlighted = docs.slice(0, 3);
        const projectsInfo = highlighted
          .map(
            (d, i) => `Project ${i + 1}:
      Name: ${d.metadata.name}
      Technologies: ${d.metadata.technologies.join(", ")}
      Key achievements: ${d.metadata.highlights.join("; ")}`
          )
          .join("\n\n");
        const prompt = `
      You are a professional portfolio assistant. Use ONLY the following project information EXACTLY as provided. 
      DO NOT invent anything, do not change project names, technologies, or achievements.
      
      ${projectsInfo}
      
      Generate a friendly, portfolio-style text:
      - Start with a casual intro, e.g., "I've got some cool projects under my belt! 🎉 Here are a few highlights:"
      - Use short bullet points (1-2 sentences) for each project describing what it does and its impact.
      - Add emojis where appropriate.
      - Mention that there are other projects in one sentence after the highlighted ones.
      - End with a friendly closing line inviting engagement, e.g., "Got a project you wanna dive into? 😄"
      - Keep it concise, fun, and professional.
      `;
      
        const aiTextRaw = await generateText(prompt);
        const aiText = cleanAIResponse(aiTextRaw);
      
        return res.json({ structured: docs, aiText });
      }
      

      case "skills": {
        const docs = index.documents.filter(d => d.metadata.section === section);
        const skillListing = docs
          .map(d => `**${d.metadata.category}**\n- ${d.metadata.items.join("\n- ")}`)
          .join("\n\n");
        const prompt = `
      You are a professional portfolio assistant. Using ONLY the following skill categories and items, 
      write a short, friendly paragraph in first-person about my skills. 
      
      ${skillListing}
      
      Requirements:
      - Use first-person ("I", "my") from my perspective
      - Mention the breadth of skills and diversity (frontend, backend, AI, tools, soft skills)
      - Keep it friendly, approachable, and concise
      - Use emojis appropriately
      `;
      
        const aiTextRaw = await generateText(prompt);
        const aiText = cleanAIResponse(aiTextRaw);
      
        return res.json({ structured: docs, aiText });
      }
             
      case "experience": {
        const docs = index.documents
          .filter(d => d.metadata.section === section)
          .sort((a, b) => {
            const getStartDate = p => new Date(p.split(" - ")[0]);
            return getStartDate(b.metadata.period) - getStartDate(a.metadata.period);
          });
        const experiencesInfo = docs
          .map(
            d => `Role: ${d.metadata.role}; Company: ${d.metadata.company}; Highlights: ${d.metadata.highlights.join(
              "; "
            )}`
          )
          .join("\n");
        const prompt = `
      You are a professional portfolio assistant. Using ONLY the following experience information, 
      write a friendly, use short bullet points reflecting on my learning, growth, skills, 
      and excitement for future challenges.
      
      ${experiencesInfo}
      
      Requirements:
      - Write in first-person (“I”, “my”) from my perspective
      - Do NOT refer to "you" or "your journey"
      - Include emojis where appropriate
      - Keep it concise, professional, and growth-oriented
      - Mention enthusiasm for full-time opportunities`;
      
        const aiTextRaw = await generateText(prompt);
        const aiText = cleanAIResponse(aiTextRaw);
      
        return res.json({ structured: docs, aiText });
      }
      

      case "contact": {
        const doc = index.documents.find(d => d.metadata.section === "contact");
        return res.json({ structured: doc });
      }

      default:
        return res.status(404).json({ error: "Section not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
