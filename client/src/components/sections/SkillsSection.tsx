import React from 'react';

interface SkillsSectionProps {
  structured: any;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ structured }) => {
  const skills: string[] = structured?.skills || (structured?.name ? [structured.name] : []);
  const title = structured?.title || '🛠 Technical Skills';

  return (
    <div className="text-left">
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span key={s} className="px-2 py-1 text-sm rounded-full bg-blue-50 text-blue-700 border border-blue-200">{s}</span>
        ))}
        {skills.length === 0 && <p className="text-gray-700">No skills found.</p>}
      </div>
    </div>
  );
};

export default SkillsSection;


