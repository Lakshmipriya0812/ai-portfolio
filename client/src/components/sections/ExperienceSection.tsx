import React from "react";
import { ExperienceTestimonial } from "../ExperienceTestimonial"; 

interface ExperienceItem {
  role?: string;
  company?: string;
  period?: string;
  highlights?: string[];
}

interface ExperienceSectionProps {
  structured: {
    title?: string;
    items: ExperienceItem[];
  };
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ structured }) => {
  const items: ExperienceItem[] = structured?.items || [];

  if (!items.length) return null;

  return (
    <div className="text-left space-y-4">
      <ExperienceTestimonial experiences={items} autoplay />
    </div>
  );
};

export default ExperienceSection;