import React from 'react';

interface ProjectItem {
  name?: string;
  title?: string;
  description?: string;
  technologies?: string[] | string;
  tech?: string[];
  highlights?: string[];
  link?: string;
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
    link: structured?.link
  } : null;
  const projects: ProjectItem[] = projectsFromArray.length > 0 ? projectsFromArray : (singleFromStructured ? [singleFromStructured] : []);
  const title = structured?.title || '📁 Projects';

  return (
    <div className="text-left space-y-4">
      <h3 className="text-2xl font-semibold">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p, idx) => (
          <div key={idx} className="p-4 rounded-xl border bg-white/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold">{p.name || p.title || 'Untitled Project'}</h4>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                  Visit
                </a>
              )}
            </div>
            {p.description && <p className="text-gray-700 mb-2">{p.description}</p>}
            {Array.isArray(p.highlights) && p.highlights.length > 0 && (
              <ul className="list-disc pl-6 text-sm text-gray-800 mb-2">
                {p.highlights.map((h, i) => (<li key={i}>{h}</li>))}
              </ul>
            )}
            {Array.isArray(p.tech) && p.tech.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {p.tech.map(t => (
                  <span key={t} className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {t}
                  </span>
                ))}
              </div>
            )}
            {p.technologies && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(Array.isArray(p.technologies) ? p.technologies : String(p.technologies).split(/\s*,\s*/)).filter(Boolean).map(t => (
                  <span key={t} className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-gray-700">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;


