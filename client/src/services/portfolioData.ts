export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface Skill {
  category: string;
  skills: string[];
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  location: string;
  about: string;
  github: string;
  linkedin: string;
  website?: string;
}

export const profileData: Profile = {
  name: "Lakshmipriya",
  title: "Full-Stack Developer & AI Enthusiast",
  email: "lakshmipriya@example.com",
  location: "Chennai, India",
  about: "Passionate developer with expertise in modern web technologies, AI/ML, and cloud computing. I love building scalable applications and exploring cutting-edge technologies. Currently focused on creating AI-powered solutions and modern web experiences.",
  github: "https://github.com/lakshmipriya",
  linkedin: "https://linkedin.com/in/lakshmipriya",
  website: "https://lakshmipriya.dev"
};

export const projectsData: Project[] = [
  {
    id: "1",
    title: "AI-Powered Portfolio",
    description: "A conversational AI portfolio built with React, TypeScript, and modern web technologies. Features real-time chat interface, responsive design, and integration with Mistral-7B-Instruct model.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "AI Integration", "Next.js"],
    githubUrl: "https://github.com/lakshmipriya/ai-portfolio",
    liveUrl: "https://ai-portfolio.lakshmipriya.dev"
  },
  {
    id: "2",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with payment integration, inventory management, admin dashboard, and real-time analytics.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS", "Socket.io"],
    githubUrl: "https://github.com/lakshmipriya/ecommerce-platform",
    liveUrl: "https://ecommerce.lakshmipriya.dev"
  },
  {
    id: "3",
    title: "Data Analysis Dashboard",
    description: "Python-based data analysis and visualization tool for business intelligence, featuring interactive charts and real-time data processing.",
    technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Streamlit", "Plotly"],
    githubUrl: "https://github.com/lakshmipriya/data-analysis-tool",
    liveUrl: "https://dashboard.lakshmipriya.dev"
  },
  {
    id: "4",
    title: "Task Management App",
    description: "Mobile-first task management application with real-time collaboration, cloud sync, and AI-powered task prioritization.",
    technologies: ["React Native", "Firebase", "Redux", "TypeScript", "AI/ML"],
    githubUrl: "https://github.com/lakshmipriya/task-manager",
    liveUrl: "https://tasks.lakshmipriya.dev"
  },
  {
    id: "5",
    title: "AI Chat Assistant",
    description: "Intelligent chatbot powered by advanced language models, featuring natural language processing and context-aware responses.",
    technologies: ["Python", "OpenAI API", "FastAPI", "React", "WebSocket"],
    githubUrl: "https://github.com/lakshmipriya/ai-chat-assistant",
    liveUrl: "https://chat.lakshmipriya.dev"
  }
];

export const skillsData: Skill[] = [
  {
    category: "Frontend",
    skills: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS", "Framer Motion"],
    proficiency: "expert"
  },
  {
    category: "Backend",
    skills: ["Node.js", "Python", "Express.js", "FastAPI", "GraphQL", "REST APIs"],
    proficiency: "advanced"
  },
  {
    category: "Database",
    skills: ["MongoDB", "PostgreSQL", "Redis", "Firebase", "Prisma", "TypeORM"],
    proficiency: "advanced"
  },
  {
    category: "Cloud & DevOps",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "Vercel"],
    proficiency: "intermediate"
  },
  {
    category: "AI/ML",
    skills: ["TensorFlow", "PyTorch", "Scikit-learn", "OpenAI API", "Hugging Face", "LangChain"],
    proficiency: "intermediate"
  },
  {
    category: "Mobile",
    skills: ["React Native", "Flutter", "Expo", "Mobile UI/UX"],
    proficiency: "intermediate"
  }
];

export const experienceData: Experience[] = [
  {
    id: "1",
    title: "Senior Full-Stack Developer",
    company: "TechCorp Solutions",
    duration: "2022 - Present",
    description: "Leading development of scalable web applications, mentoring junior developers, and implementing best practices for code quality and performance.",
    technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"]
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "StartupXYZ",
    duration: "2021 - 2022",
    description: "Built responsive user interfaces and implemented modern frontend architectures for web applications.",
    technologies: ["React", "Vue.js", "JavaScript", "CSS3", "Webpack"]
  },
  {
    id: "3",
    title: "Junior Developer",
    company: "Digital Innovations",
    duration: "2020 - 2021",
    description: "Developed and maintained web applications, collaborated with cross-functional teams, and learned modern development practices.",
    technologies: ["JavaScript", "HTML", "CSS", "PHP", "MySQL"]
  }
];

export const getPortfolioData = () => {
  return {
    profile: profileData,
    projects: projectsData,
    skills: skillsData,
    experience: experienceData
  };
};

export const generateResponse = (userInput: string): string => {
  const input = userInput.toLowerCase();
  const data = getPortfolioData();
  
  // Projects
  if (input.includes('project') || input.includes('work')) {
    if (input.includes('recent') || input.includes('latest')) {
      const latestProject = data.projects[0];
      return `My latest project is "${latestProject.title}" - ${latestProject.description}. It uses ${latestProject.technologies.join(', ')}. Would you like to know more about it?`;
    }
    return `I've worked on ${data.projects.length} major projects including ${data.projects.map(p => p.title).join(', ')}. Which project interests you most?`;
  }
  
  // Skills
  if (input.includes('skill') || input.includes('technology') || input.includes('tech')) {
    const allSkills = data.skills.flatMap(skill => skill.skills);
    return `My technical skills include ${allSkills.slice(0, 10).join(', ')} and more. I'm particularly strong in frontend development and have intermediate expertise in AI/ML. What area would you like to know more about?`;
  }
  
  // Experience
  if (input.includes('experience') || input.includes('background') || input.includes('career')) {
    return `I have ${data.experience.length} years of experience in software development. Currently working as ${data.experience[0].title} at ${data.experience[0].company}. I've worked with startups and enterprise clients, building scalable applications.`;
  }
  
  // Contact
  if (input.includes('contact') || input.includes('reach') || input.includes('email')) {
    return `You can reach me at ${data.profile.email}, connect on LinkedIn at ${data.profile.linkedin}, or check out my work on GitHub at ${data.profile.github}. I'm always open to discussing new opportunities!`;
  }
  
  // About
  if (input.includes('about') || input.includes('who') || input.includes('introduce')) {
    return `${data.profile.about} I'm based in ${data.profile.location} and specialize in ${data.profile.title}. What would you like to know more about?`;
  }
  
  // Default response
  return "That's an interesting question! I'd be happy to help you learn more about my background, projects, skills, or experience. What would you like to know specifically?";
}; 