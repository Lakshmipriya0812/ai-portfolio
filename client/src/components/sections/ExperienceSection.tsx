import React from 'react';

interface ExperienceItem {
  role?: string;
  company?: string;
  period?: string;
  highlights?: string[];
}

interface ExperienceSectionProps {
  structured: any;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ structured }) => {
  const items: ExperienceItem[] = structured?.items || [structured];
  const title = structured?.title || '💼 Experience';

  return (
    <div className="text-left space-y-4">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="space-y-4">
        {items.filter(Boolean).map((exp, idx) => (
          <div key={idx} className="p-4 rounded-xl border bg-white/50">
            <h4 className="text-lg font-semibold">{exp.role}{exp.company ? ` @ ${exp.company}` : ''}</h4>
            {exp.period && <p className="text-gray-600 mb-2">{exp.period}</p>}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul className="list-disc pl-6 space-y-1 text-gray-800">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceSection;


