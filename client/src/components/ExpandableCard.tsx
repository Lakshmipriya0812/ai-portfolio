"use client";

import { useEffect, useId, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../hooks/use-outside-click";


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

interface ExpandableCardProps {
  projects: ProjectItem[];
}

export function ExpandableCard({ projects }: ExpandableCardProps) {
  const [active, setActive] = useState<ProjectItem | null>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const outsideClickRef = useOutsideClick<HTMLDivElement>(() => setActive(null));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);



  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
  
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  
    // Force arrow update shortly after scroll
    setTimeout(() => {
      if (scrollRef.current) {
        const el = scrollRef.current;
        const threshold = 5;
        setShowLeftArrow(el.scrollLeft > threshold);
        setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - threshold);
      }
    }, 300); // Adjust based on scroll animation speed
  };
  

  const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
  
  const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ); 

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
  
    function updateArrows() {
      if (!el) return;
    
      const scrollLeft = el.scrollLeft;
      const scrollRight = el.scrollLeft + el.clientWidth;
      const maxScrollRight = el.scrollWidth;
    
      const threshold = 5;
    
      
      setShowLeftArrow(scrollLeft > threshold);
      setShowRightArrow(scrollRight < maxScrollRight - threshold);
    }
    
    

    updateArrows(); // check initially
    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows); // optional: recalc on resize
  
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, []);


  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.button
              key={`button-${active.name || active.title}-${id}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 right-4 lg:hidden items-center justify-center bg-white shadow-lg rounded-full h-8 w-8 z-20 flex"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              ref={outsideClickRef}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-[800px] max-h-[90vh] overflow-y-auto flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Header with gradient */}
              <div className="relative h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Project Overview</h2>
              </div>

              {/* Content area with proper scrolling */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Fixed header */}
                <div className="flex-shrink-0 p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-2xl mb-2">
                        {active.name || active.title || 'Untitled Project'}
                      </h3>
                    </div>

                    <div className="flex gap-3 ml-6">
                      {active.github && (
                       <a
                       href={active.github}
                       target="_blank"
                       rel="noreferrer"
                       className="px-4 py-2 text-sm rounded-full font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all duration-200 shadow-md hover:shadow-lg"
                     >
                       GitHub
                     </a>                     
                      )}
                      {active.demo && (
                        <a
                          href={active.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 text-sm rounded-full font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Scrollable content */}
                <div className="flex-1">
                <div className="p-6 space-y-10">
                {/* Highlights */}
                {Array.isArray(active.highlights) && active.highlights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-indigo-500 rounded-sm" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Key Contributions
                      </h4>
                    </div>
                    <ul className="space-y-3 list-none">
                      {active.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed">
                          <span className="mt-1.5 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <circle cx="10" cy="10" r="4" />
                            </svg>
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Technologies */}
                {(active.technologies || active.tech) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-rose-500 rounded-sm" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                        Technologies Used
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(Array.isArray(active.technologies) ? active.technologies : 
                        Array.isArray(active.tech) ? active.tech :
                        String(active.technologies || active.tech).split(/\s*,\s*/))
                        .filter(Boolean)
                        .map((tech, i) => (
                          <span
                            key={i}
                            className="px-5 py-3 text-xs rounded-full font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-lg"
              >
                            {tech}
                          </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Project Link (optional CTA) */}
                {active.link && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="pt-4"
                  >
                    <a
                      href={active.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 text-xs rounded-full font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-700 transition-all duration-200 shadow-sm hover:shadow-lg"
              >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M10 14L21 3M21 3h-6M21 3v6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Visit Project
                    </a>
                  </motion.div>
                )}
              </div>

                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      
      {/* Projects container with dedicated scrolling */}
      <div className="relative max-w-7xl mx-auto w-full">
        {/* Left Scroll Button */}
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
          >
            <ChevronLeftIcon />
          </button>
        )}

        {/* Scroll Container (with cards) */}
        <div
          ref={scrollRef}
          className="scroll-smooth flex overflow-x-auto gap-4 px-8 py-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 hide-scrollbar"
        >
        {projects.map((project) => (
          <motion.div
            key={`card-${project.name || project.title}-${id}`}
            layoutId={`card-${project.name || project.title}-${id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{
              rotate: [0, -2, 2, -2, 0],
              scale: 1.02
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            onClick={() => setActive(project)}
            className="flex-shrink-0 w-[250px] sm:w-[250px] md:w-[250px] h-[300px] snap-start p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-2xl cursor-pointer"
          >

              <div className="flex gap-4 flex-col md:flex-row items-center md:items-start">
                
                <div className="flex-1 text-center md:text-left line-clamp-4">
                <motion.h3
                  layoutId={`title-${project.name || project.title}-${id}`}
                  className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 max-w-xs sm:max-w-sm md:max-w-md"
                >
                  {project.name || project.title || 'Untitled Project'}
                </motion.h3>


                  
                  {/* Technologies preview */}
                  {(project.technologies || project.tech) && (
                    <div className="mt-10 w-full flex flex-wrap gap-1 justify-center md:justify-start">
                    {(Array.isArray(project.technologies) ? project.technologies : 
                      Array.isArray(project.tech) ? project.tech :
                      String(project.technologies || project.tech).split(/\s*,\s*/)).filter(Boolean).slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 max-w-full text-xs rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 font-medium whitespace-normal break-words"
                      >
                        {tech}
                      </span>
                    ))}
                    {((Array.isArray(project.technologies) ? project.technologies : 
                      Array.isArray(project.tech) ? project.tech :
                      String(project.technologies || project.tech).split(/\s*,\s*/)).filter(Boolean).length > 3) && (
                      <span
                        className="px-2 py-1 max-w-full text-xs rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200 font-medium whitespace-normal break-words"
                      >
                        +{((Array.isArray(project.technologies) ? project.technologies : 
                          Array.isArray(project.tech) ? project.tech :
                          String(project.technologies || project.tech).split(/\s*,\s*/)).filter(Boolean).length - 3)}
                      </span>
                    )}
                  </div>                  
                  )}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-end">
                {project.github && (
                  <motion.a
                    layoutId={`github-${project.name || project.title}-${id}`}
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 text-xs rounded-full font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-black hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub
                  </motion.a>
                )}
                {project.demo && (
                  <motion.a
                    layoutId={`demo-${project.name || project.title}-${id}`}
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 text-xs rounded-full font-semibold text-white bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Demo
                  </motion.a>
                )}
                <motion.button
                  layoutId={`button-${project.name || project.title}-${id}`}
                  className="px-4 py-2 text-xs rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  View Details
                </motion.button>
              </div>

            </motion.div>
          ))}
        {/* Right Scroll Button */}
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-900/80 p-2 rounded-full shadow-lg backdrop-blur-md hover:scale-105 transition-transform"
          >
            <ChevronRightIcon />
          </button>
        )}
        </div>
      </div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-gray-600 hover:text-gray-800 transition-colors"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
