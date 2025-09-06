import React from 'react';

interface ContactSectionProps {
  structured: any;
}

const ContactSection: React.FC<ContactSectionProps> = ({ structured }) => {
  const email = structured?.email;
  const phone = structured?.phone;
  const linkedin = structured?.linkedin;
  const github = structured?.github;
  const title = structured?.title || '📬 Contact';

  return (
    <div className="text-left space-y-2">
      <h3 className="text-2xl font-semibold">{title}</h3>
      {email && (<p>✉️ <a className="text-blue-600 hover:underline" href={`mailto:${email}`}>{email}</a></p>)}
      {phone && (<p>📞 <a className="text-blue-600 hover:underline" href={`tel:${phone}`}>{phone}</a></p>)}
      {linkedin && (<p>🔗 <a className="text-blue-600 hover:underline" href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>)}
      {github && (<p>🐙 <a className="text-blue-600 hover:underline" href={github} target="_blank" rel="noreferrer">GitHub</a></p>)}
    </div>
  );
};

export default ContactSection;


