import React from 'react';

interface EducationItem {
  institution?: string;
  degree?: string;
  field?: string;
  period?: string;
  highlights?: string[];
}

interface EducationSectionProps {
  structured: any;
}

const EducationSection: React.FC<EducationSectionProps> = ({ structured }) => {
  const items: EducationItem[] = structured?.items || [structured];
  const title = structured?.title || '🎓 Education';

  return (
    <div className="text-left space-y-4">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="space-y-4">
        {items.filter(Boolean).map((ed, idx) => (
          <div key={idx} className="p-4 rounded-xl border bg-white/50">
            <h4 className="text-lg font-semibold">{ed.institution}</h4>
            <p className="text-gray-700 mb-1">{[ed.degree, ed.field].filter(Boolean).join(', ')}</p>
            {ed.period && <p className="text-gray-600 mb-2">{ed.period}</p>}
            {ed.highlights && ed.highlights.length > 0 && (
              <ul className="list-disc pl-6 space-y-1 text-gray-800">
                {ed.highlights.map((h, i) => (
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

export default EducationSection;


