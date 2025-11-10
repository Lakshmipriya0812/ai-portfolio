import fs from "fs";
import path from "path";
import { generateText } from "../lib/generation.js";
import {
  getCachedResponse,
  setCachedResponse,
  clearCache,
} from "../lib/cache.js";

const indexPath = path.join(process.cwd(), "storage", "indexStore.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

// Clear cache on startup to ensure fresh responses
clearCache();

if (process.env.NODE_ENV === "development") {
  console.log("Cache cleared on startup");
}

// ---------------- Helper function ----------------
function cleanAIResponse(aiResponse) {
  if (!aiResponse) return "";
  return aiResponse.includes("</think>")
    ? aiResponse.split("</think>").pop().trim()
    : aiResponse.trim();
}

// Fast AI generation with caching
async function getAIResponse(section, prompt, forceGenerate = false) {
  // Check cache first
  const cacheKey = `${section}_${prompt.slice(0, 100)}`;
  const cached = getCachedResponse(cacheKey);
  if (cached && !forceGenerate) {
    if (process.env.NODE_ENV === "development") {
      console.log(`Cache hit for section: ${section}`);
    }
    return cached;
  }

  // Generate new response
  try {
    const aiTextRaw = await generateText(prompt);
    const aiText = cleanAIResponse(aiTextRaw);

    if (!aiText || aiText.trim().length === 0) {
      throw new Error("AI generated empty response");
    }

    // Cache the response
    setCachedResponse(cacheKey, aiText);
    return aiText;
  } catch (error) {
    console.error(
      `Failed to generate AI response for ${section}:`,
      error.message
    );
    throw error;
  }
} // ---------------- Controller ----------------
export async function getSection(req, res) {
  const { section } = req.params;
  const myName = "Lakshmipriya";

  try {
    switch (section) {
      case "about": {
        const doc = index.documents.find((d) => d.metadata.section === "about");
        const prompt = `Write a friendly, enthusiastic 4-5 line introduction using this content: "${doc.content}". 

Requirements:
- Start with "Hello, I'm Lakshmipriya!" with a greeting emoji
- Mention your MS from Drexel University
- Highlight full-stack development, DevOps, and AI-powered systems expertise
- Include your experience with Python, Java, JavaScript, React, Spring Boot, SQL, and AWS
- Add enthusiasm and personality with appropriate emojis
- Make it warm and engaging, like you're excited to share your story`;

        const aiText = await getAIResponse("about", prompt);
        return res.json({ structured: { ...doc, type: "about" }, aiText });
      }

      case "fun": {
        const doc = index.documents.find((d) => d.metadata.section === "fun");
        const prompt = `Write an enthusiastic, detailed response about my baking hobby using this content: "${doc.content}". 

Requirements:
- Start with "Hello, I'm Lakshmipriya!" with a friendly emoji
- Write 4-5 sentences about my passion for baking
- Mention specific treats: rainbow cakes, strawberry cakes, cupcakes, fudges, brownies, mousse
- Talk about creativity, flavors, textures, colors, and sharing with friends/family
- Include plenty of baking emojis (🧁 🎂 🍰 🌈 ✨ etc.)
- Show genuine excitement and passion for this creative outlet
- End with something warm about how baking brings joy`;

        const aiText = await getAIResponse("fun", prompt);
        return res.json({ structured: doc, aiText });
      }

      case "projects": {
        const docs = index.documents.filter(
          (d) => d.metadata.section === section
        );
        const highlighted = docs.slice(0, 3);

        const projectsInfo = highlighted
          .map(
            (d, i) => `Project ${i + 1}: ${d.metadata.name}
Technologies: ${d.metadata.technologies.join(", ")}
Key achievements: ${d.metadata.highlights.join("; ")}
${d.metadata.demo ? `Demo: ${d.metadata.demo}` : ""}
${d.metadata.github ? `GitHub: ${d.metadata.github}` : ""}`
          )
          .join("\n\n");

        const prompt = `Write a fun intro about these projects using ONLY this data:

${projectsInfo}

Start with "I've got some cool projects!" Use brief bullet points for each project. Add project emojis. Keep it conversational and mention there are more projects. End with engagement question.`;

        const aiText = await getAIResponse("projects", prompt);

        const projectsData = {
          type: "projects",
          items: docs.map((doc) => ({
            name: doc.metadata.name,
            title: doc.metadata.name,
            description: doc.metadata.description || "",
            technologies: doc.metadata.technologies || [],
            tech: doc.metadata.technologies || [],
            highlights: doc.metadata.highlights || [],
            link: doc.metadata.link || "",
            github: doc.metadata.github || "",
            demo: doc.metadata.demo || "",
          })),
        };

        return res.json({ structured: projectsData, aiText });
      }

      case "skills": {
        const docs = index.documents.filter(
          (d) => d.metadata.section === section
        );

        const skillListing = docs
          .map((d) => `${d.metadata.category}: ${d.metadata.items.join(", ")}`)
          .join("\n");

        const prompt = `Write an enthusiastic, detailed paragraph about my diverse technical skills using this data:

${skillListing}

Requirements:
- Use first-person ("I", "my") from my perspective
- Write 3-4 sentences highlighting the breadth of skills
- Mention how I work across frontend, backend, DevOps, AI tools, and soft skills
- Add relevant tech emojis (💻 🚀 ⚡ 🛠️ etc.)
- Show excitement and passion for technology
- Keep it conversational and engaging`;

        const aiText = await getAIResponse("skills", prompt);

        const skillsData = {
          type: "skills",
          title: "Skills & Expertise",
          categories: docs.map((doc) => ({
            title: doc.metadata.category,
            skills: doc.metadata.items || [],
          })),
        };

        return res.json({ structured: skillsData, aiText });
      }

      case "experience": {
        const docs = index.documents
          .filter((d) => d.metadata.section === section)
          .sort((a, b) => {
            const getStartDate = (p) => new Date(p.split(" - ")[0]);
            return (
              getStartDate(b.metadata.period) - getStartDate(a.metadata.period)
            );
          });

        // Generate enhanced bullet points for each position
        const itemsWithAI = await Promise.all(
          docs.map(async (doc) => {
            const prompt = `Take these work highlights and enhance them into engaging, impactful bullet points:

Role: ${doc.metadata.role} at ${doc.metadata.company}
Original highlights:
${doc.metadata.highlights.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Requirements:
- Return exactly ${
              doc.metadata.highlights.length
            } bullet points (one per original highlight)
- Make each point start with a strong action verb
- Keep the technical details and technologies mentioned
- Add relevant emojis (🚀 💻 ⚡ 🛠️ 📊 etc.)
- Make it sound impressive but authentic
- Each point should be 1-2 lines maximum
- Return ONLY the bullet points, no introduction or conclusion
- Format: Start each line with "• " (bullet point)`;

            const aiEnhanced = await getAIResponse(
              `exp_${doc.metadata.company}`,
              prompt
            );

            // Parse AI response into array of bullet points
            const enhancedPoints = aiEnhanced
              .split("\n")
              .filter((line) => line.trim().length > 0)
              .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
              .filter((line) => line.length > 0);

            return {
              role: doc.metadata.role,
              company: doc.metadata.company,
              period: doc.metadata.period,
              highlights: doc.metadata.highlights, // Original highlights
              enhancedHighlights:
                enhancedPoints.length > 0
                  ? enhancedPoints
                  : doc.metadata.highlights,
            };
          })
        );

        const experienceData = {
          type: "experience",
          title: "💼 Professional Experience",
          items: itemsWithAI,
        };

        return res.json({ structured: experienceData });
      }

      case "contact": {
        const doc = index.documents.find(
          (d) => d.metadata.section === "contact"
        );
        return res.json({ structured: doc });
      }

      default:
        return res.status(404).json({ error: "Section not found" });
    }
  } catch (err) {
    console.error(`Error in getSection for ${section}:`, err.message);
    res.status(500).json({
      error: "Failed to retrieve section data",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
