import React from 'react';
import { FiMail, FiPhone, FiLinkedin, FiGithub } from 'react-icons/fi';

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  link: string;
}

interface ContactMetadata {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  [key: string]: any;
}

interface StructuredContent {
  metadata?: ContactMetadata;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  title?: string;
  content?: string;
  text?: string;
}

interface ContactSectionProps {
  structured: StructuredContent;
}

const ContactSection: React.FC<ContactSectionProps> = ({ structured }) => {
  const meta = structured?.metadata || {};
  const email = meta.email || structured?.email;
  const phone = meta.phone || structured?.phone;
  const linkedin = meta.linkedin || meta.LinkedIn || structured?.linkedin;
  const github = meta.github || meta.GitHub || structured?.github;
  const title = structured?.title || 'Get in Touch';
  const fallbackContent = structured?.content || structured?.text;

  const contacts: ContactItem[] = [
    email && {
      icon: <FiMail />,
      label: 'Email',
      value: email,
      link: `mailto:${email}`,
    },
    phone && {
      icon: <FiPhone />,
      label: 'Phone',
      value: phone,
      link: `tel:${phone}`,
    },
    linkedin && {
      icon: <FiLinkedin />,
      label: 'LinkedIn',
      value: 'View Profile',
      link: linkedin,
    },
    github && {
      icon: <FiGithub />,
      label: 'GitHub',
      value: 'View Repos',
      link: github,
    },
  ].filter(Boolean) as ContactItem[];

  return (
    <section className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-3xl font-semibold text-white mb-6">Get In Touch</h2>
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contacts.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${item.label}`}
              className="group flex items-start gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition duration-300"
            >
              <span className="text-2xl text-blue-400 group-hover:text-blue-500">
                {item.icon}
              </span>
              <div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-base font-medium text-white break-all">{item.value}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 text-lg">{fallbackContent}</p>
      )}
    </section>
  );
};

export default ContactSection;
