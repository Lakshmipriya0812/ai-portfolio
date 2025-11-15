import React from "react";
import { ExperienceTestimonial } from "../ExperienceTestimonial";

interface ExperienceItem {
  role?: string;
  company?: string;
  period?: string;
  highlights?: string[];
  enhancedHighlights?: string[];
}

interface ExperienceSectionProps {
  structured: {
    title?: string;
    items: ExperienceItem[];
  };
  aiText?: string;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  structured,
}) => {
  const items: ExperienceItem[] = structured?.items || [];
  if (!items.length) return null;

  return (
    <div className="experience-section w-full">
      <div className="text-left space-y-4 mb-8">
        <ExperienceTestimonial experiences={items} />
      </div>
    </div>
  );
};

export default ExperienceSection;
