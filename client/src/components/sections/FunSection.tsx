import React from "react";

interface FunSectionProps {
  aiText?: string;
}

const FunSection: React.FC<FunSectionProps> = ({ aiText }) => {
  const title = "🎉 Fun & Hobbies";
  const lines = aiText
    ? aiText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
  const paragraphs = lines.filter((line) => !/^[-•]\s+/.test(line));
  const bulletPoints = lines
    .filter((line) => /^[-•]\s+/.test(line))
    .map((line) => line.replace(/^[-•]\s+/, "").trim());

  if (!aiText) {
    return (
      <div className="text-gray-500 text-center">
        <p>No fun & hobbies information available.</p>
      </div>
    );
  }
  return (
    <div className="response-wrapper">
      <div className=" bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 text-left flex flex-col justify-center h-auto w-full max-w-xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          {title}
        </h3>

        {/* Render paragraphs */}
        {paragraphs.map((para, idx) => (
          <p
            key={`para-${idx}`}
            className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4"
          >
            {para}
          </p>
        ))}

        {/* Render bullet points */}
        {bulletPoints.length > 0 && (
          <ul className="mt-4 list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {bulletPoints.map((point, idx) => (
              <li key={`bullet-${idx}`}>{point}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-2 text-sm text-gray-500 dark:text-gray-400 italic">
          Baking is more than a hobby—it's a way to share joy! 🍰
        </div>
      </div>
    </div>
  );
};

export default FunSection;
