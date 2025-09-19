"use client";

import React from "react";
import { CardContainer, CardBody, CardItem } from "../../components/ui/3d-card";

interface MeSectionProps {
  aiText: string;
  containerClassName?: string;
}

const MeSection: React.FC<MeSectionProps> = ({ aiText, containerClassName }) => {
  return (
    <CardContainer containerClassName={containerClassName}>
      <CardBody className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex flex-col items-center justify-center h-auto w-full max-w-md">
      {/* Heading */}
        <CardItem translateZ={15} className="mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            About Me
          </h2>
        </CardItem>

        {/* AI Text */}
        <CardItem translateZ={10}>
          <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed text-center whitespace-pre-line">
            {aiText}
          </p>
        </CardItem>
      </CardBody>
    </CardContainer>
  );
};

export default MeSection;
