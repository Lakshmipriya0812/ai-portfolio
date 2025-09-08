import React from 'react';
import { ExpandableCard } from '../ExpandableCard';

interface ProjectItem {
  name?: string;
  title?: string;
  description?: string;
  technologies?: string[] | string;
  tech?: string[];
  highlights?: string[];
  link?: string;
  github?: string;
  demo?: string;
}

interface ProjectsSectionProps {
  structured: any;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ structured }) => {
  const projectsFromArray: ProjectItem[] = structured?.projects || [];
  const singleFromStructured: ProjectItem | null = projectsFromArray.length === 0 ? {
    name: structured?.name || structured?.title,
    title: structured?.title,
    description: structured?.description,
    technologies: structured?.technologies,
    tech: structured?.tech,
    highlights: structured?.highlights,
    link: structured?.link,
    github: structured?.github,
    demo: structured?.demo
  } : null;
  const projects: ProjectItem[] = projectsFromArray.length > 0 ? projectsFromArray : (singleFromStructured ? [singleFromStructured] : []);
  const title = structured?.title || '📁 Projects';

  return (
    <div className="text-left space-y-4">
      <h3 className="text-2xl font-semibold text-center mb-8">{title}</h3>
      {projects.length > 0 ? (
        <ExpandableCard projects={projects} />
      ) : (
        <p className="text-gray-700 text-center">No projects found.</p>
      )}
    </div>
  );
};

export default ProjectsSection;


