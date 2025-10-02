import {
  FaCode,
  FaServer,
  FaDatabase,
  FaCogs,
  FaVial,
  FaPaintBrush,
  FaBrain,
  FaComments,
} from "react-icons/fa";

import type { ReactElement } from "react";

const iconMap: Record<string, ReactElement> = {
  Frontend: (
    <FaCode className="inline-block mr-2 text-indigo-500 opacity-90 text-base" />
  ),
  Backend: (
    <FaServer className="inline-block mr-2 text-rose-500 opacity-90 text-base" />
  ),
  Databases: (
    <FaDatabase className="inline-block mr-2 text-emerald-500 opacity-90 text-base" />
  ),
  "DevOps & CI/CD": (
    <FaCogs className="inline-block mr-2 text-yellow-500 opacity-90 text-base" />
  ),
  Testing: (
    <FaVial className="inline-block mr-2 text-purple-500 opacity-90 text-base" />
  ),
  "Design Tools": (
    <FaPaintBrush className="inline-block mr-2 text-pink-500 opacity-90 text-base" />
  ),
  "AI Tools": (
    <FaBrain className="inline-block mr-2 text-sky-500 opacity-90 text-base" />
  ),
  "Soft Skills": (
    <FaComments className="inline-block mr-2 text-gray-500 opacity-90 text-base" />
  ),
};

interface SkillsSectionProps {
  structured: {
    title?: string;
    categories?: {
      title: string;
      skills: string[];
    }[];
  };
  aiText?: string;
}

const SkillsSection = ({ structured, aiText }: SkillsSectionProps) => {
  if (!structured?.categories?.length) {
    return (
      <div className="text-gray-500 text-center">
        <p>No skill categories found.</p>
      </div>
    );
  }

  return (
    <div className="skills-section w-full">
      {/* Skills Content */}
      <section className="text-left mb-8">
        {/* Header */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-black mb-8">
          {structured.title || "Skills & Expertise"}
        </h2>

        {/* Categories */}
        <div className="max-h-[400px] overflow-y-auto pr-1 space-y-8">
          {structured.categories.map((category, idx) => {
            const icon = iconMap[category.title] || null;

            return (
              <div key={idx}>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-black mb-4 flex items-center">
                  {icon}
                  {category.title}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 text-sm font-medium text-gray-800 dark:text-black bg-balck/60 dark:bg-black/10 border border-gray-400 dark:border-white/20 backdrop-blur-md rounded-full shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Insights Section */}
      {aiText && (
        <div className="ai-insights-section mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Core Competencies
              </h3>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {aiText
                  .replace(/^"|"$/g, "")
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => {
                    const trimmedLine = line.replace(/^[-•]\s*/, "").trim();
                    if (trimmedLine) {
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 mb-3 last:mb-0"
                        >
                          <div className="flex-shrink-0 mt-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {trimmedLine}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
