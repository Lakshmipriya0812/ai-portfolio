import React from 'react';
import { motion } from 'framer-motion';
import MeSection from '../sections/MeSection';
import ProjectsSection from '../sections/ProjectsSection';
import ExperienceSection from '../sections/ExperienceSection';
import SkillsSection from '../sections/SkillsSection';
import FunSection from '../sections/FunSection';
import ContactSection from '../sections/ContactSection';
import EducationSection from '../sections/EducationSection';
import { ResponseRendererProps } from '../../types/chat';

const ResponseRenderer: React.FC<ResponseRendererProps> = ({ interaction }) => {
  if (interaction.isLoading) {
    return (
      <motion.div 
        className="response-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-container">
          <div className="loader"></div>
        </div>
      </motion.div>
    );
  }

  if (interaction.structured) {
    return (
      <motion.div 
        className="response-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="response-wrapper">
          {renderStructured(interaction.structured, interaction.response)}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="response-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="response-wrapper">
        <p className="response-text">{interaction.response}</p>
      </div>
    </motion.div>
  );
};

function renderStructured(structured: any, response?: string) {
  const type = structured?.type;

  const normalizedData = {
    ...structured,
    name: structured?.name || structured?.title,
    summary: structured?.summary || structured?.text,
    response,
  };
  
  switch (type) {
    case 'me':
    case 'about':
      return <MeSection aiText={structured.aiText || response || ''} />;
    case 'projects':
    case 'project':
      return <ProjectsSection structured={normalizedData} />;
    case 'experience':
      return <ExperienceSection structured={normalizedData} />;
    case 'skills':
    case 'skill':
      return <SkillsSection structured={normalizedData} />;
    case 'fun':
      return <FunSection structured={normalizedData} />;
    case 'contact':
      return <ContactSection structured={normalizedData} />;
    case 'education':
      return <EducationSection structured={normalizedData} />;
    default:
      return <p className="response-text">{normalizedData?.text || ''}</p>;
  }
}

export default ResponseRenderer;
