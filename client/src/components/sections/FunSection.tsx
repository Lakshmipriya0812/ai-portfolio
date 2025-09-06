import React from 'react';

interface FunSectionProps {
  structured: any;
}

const FunSection: React.FC<FunSectionProps> = ({ structured }) => {
  const facts: string[] = structured?.facts || (structured?.text ? [structured.text] : []);
  const title = structured?.title || '🎉 Fun Facts';

  return (
    <div className="text-left space-y-3">
      <h3 className="text-2xl font-semibold">{title}</h3>
      {facts.length > 0 ? (
        <ul className="list-disc pl-6 space-y-1 text-gray-800">
          {facts.map((f, idx) => (
            <li key={idx}>{f}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No fun facts found.</p>
      )}
    </div>
  );
};

export default FunSection;


