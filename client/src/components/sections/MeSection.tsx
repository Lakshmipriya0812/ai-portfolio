import React from 'react';

interface MeSectionProps {
  structured: any;
}

const MeSection: React.FC<MeSectionProps> = ({ structured }) => {
  const name = structured?.name || 'About Me';
  const summary = structured?.summary || structured?.text;
  const location = structured?.location;
  const email = structured?.email;
  const avatar = structured?.avatar;

  return (
    <div className="text-left space-y-4">
      <div className="flex items-center gap-4">
        {avatar && (
          <img src={avatar} alt={name} className="w-16 h-16 rounded-full object-cover border" />
        )}
        <div>
          <h3 className="text-2xl font-semibold">👋 {name}</h3>
          {location && <p className="text-gray-600">📍 {location}</p>}
        </div>
      </div>
      {summary && <p className="text-gray-800 leading-relaxed">{summary}</p>}
      {email && (
        <p>
          ✉️ <a className="text-blue-600 hover:underline" href={`mailto:${email}`}>{email}</a>
        </p>
      )}
    </div>
  );
};

export default MeSection;


