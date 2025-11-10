import React, { useState } from "react";
import { ExpandableCard } from "../ExpandableCard";

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
  aiText?: string;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  structured,
  aiText,
}) => {
  const [showProjects, setShowProjects] = useState(true);
  const [showAI, setShowAI] = useState(true);

  let projects: ProjectItem[] = [];
  if (structured?.items && Array.isArray(structured.items)) {
    projects = structured.items;
  } else if (structured?.projects && Array.isArray(structured.projects)) {
    projects = structured.projects;
  } else if (structured && typeof structured === "object") {
    const singleProject: ProjectItem = {
      name: structured?.name || structured?.title,
      title: structured?.title,
      description: structured?.description,
      technologies: structured?.technologies,
      tech: structured?.tech,
      highlights: structured?.highlights,
      link: structured?.link,
      github: structured?.github,
      demo: structured?.demo,
    };
    if (
      singleProject.name ||
      singleProject.title ||
      singleProject.description
    ) {
      projects = [singleProject];
    }
  }

  return (
    <div className="projects-section w-full max-w-4xl mx-auto">
      {/* Visibility Toggles */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {showProjects ? "Hide Projects" : "Show Projects"}
        </button>

        {aiText && (
          <button
            onClick={() => setShowAI((prev) => !prev)}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white text-gray-800 dark:bg-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {showAI ? "Hide Project Highlights" : "Show Project Highlights"}
          </button>
        )}
      </div>

      {/* Projects Display */}
      {showProjects && (
        <div className="projects-wrapper w-full mb-8">
          {projects.length > 0 ? (
            <div className="w-full">
              <ExpandableCard projects={projects} />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No projects found
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Try asking about my portfolio or specific projects
              </p>
            </div>
          )}
        </div>
      )}

      {/* Project Highlights Section */}
      {aiText && showAI && (
        <div className="project-highlights-section mt-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-green-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r bg-blue-500 to-blue-700 rounded-lg">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Project Highlights
              </h3>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {aiText
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => {
                    let trimmed = line.trim();
                    trimmed = trimmed.replace(/\*\*/g, "");
                    const isBullet = /^[-•]\s+/.test(trimmed);

                    if (isBullet) {
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 mb-3 last:mb-0"
                        >
                          <div className="flex-shrink-0 mt-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          </div>
                          <p>{trimmed.replace(/^[-•]\s+/, "")}</p>
                        </div>
                      );
                    } else {
                      return (
                        <p key={idx} className="mb-3 last:mb-0 font-semibold">
                          {trimmed}
                        </p>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
