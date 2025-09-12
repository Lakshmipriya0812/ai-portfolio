import {
  FaCode,
  FaServer,
  FaDatabase,
  FaCogs,
  FaVial,
  FaPaintBrush,
  FaBrain,
  FaComments
} from 'react-icons/fa';

import type { ReactElement } from 'react';

const iconMap: Record<string, ReactElement> = {
  'Frontend': <FaCode className="inline-block mr-2 text-indigo-500 opacity-90 text-base" />,
  'Backend': <FaServer className="inline-block mr-2 text-rose-500 opacity-90 text-base" />,
  'Databases': <FaDatabase className="inline-block mr-2 text-emerald-500 opacity-90 text-base" />,
  'DevOps & CI/CD': <FaCogs className="inline-block mr-2 text-yellow-500 opacity-90 text-base" />,
  'Testing': <FaVial className="inline-block mr-2 text-purple-500 opacity-90 text-base" />,
  'Design Tools': <FaPaintBrush className="inline-block mr-2 text-pink-500 opacity-90 text-base" />,
  'AI Tools': <FaBrain className="inline-block mr-2 text-sky-500 opacity-90 text-base" />,
  'Soft Skills': <FaComments className="inline-block mr-2 text-gray-500 opacity-90 text-base" />,
};

interface SkillsSectionProps {
  structured: {
    title?: string;
    categories?: {
      title: string;
      skills: string[];
    }[];
  };
}

const SkillsSection = ({ structured }: SkillsSectionProps) => {
  if (!structured?.categories?.length) {
    return (
      <div className="text-gray-500 text-center">
        <p>No skill categories found.</p>
      </div>
    );
  }

  return (
    <section className="text-left">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {structured.title || '🛠 Skills & Expertise'}
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
  );
};

export default SkillsSection;
