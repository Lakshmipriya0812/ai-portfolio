// Portfolio data service for backend
// This mirrors the frontend data structure

export const profileData = {
  name: "Lakshmipriya",
  title: "Full-Stack Developer & AI Enthusiast",
  email: "lakshmipriya@example.com",
  location: "Chennai, India",
  about: "Passionate developer with expertise in modern web technologies, AI/ML, and cloud computing. I love building scalable applications and exploring cutting-edge technologies. Currently focused on creating AI-powered solutions and modern web experiences.",
  github: "https://github.com/lakshmipriya",
  linkedin: "https://linkedin.com/in/lakshmipriya",
  website: "https://lakshmipriya.dev"
};

export const projectsData = [
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

export const skillsData = [
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

export const experienceData = [
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

// Helper functions for specific data queries
export const getProjectsByTechnology = (technology) => {
  return projectsData.filter(project => 
    project.technologies.some(tech => 
      tech.toLowerCase().includes(technology.toLowerCase())
    )
  );
};

export const getSkillsByCategory = (category) => {
  return skillsData.filter(skill => 
    skill.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const getExperienceByCompany = (company) => {
  return experienceData.filter(exp => 
    exp.company.toLowerCase().includes(company.toLowerCase())
  );
};

export const searchPortfolio = (query) => {
  const searchTerm = query.toLowerCase();
  const results = {
    projects: [],
    skills: [],
    experience: []
  };
  
  // Search in projects
  results.projects = projectsData.filter(project => 
    project.title.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
  );
  
  // Search in skills
  results.skills = skillsData.filter(skill => 
    skill.category.toLowerCase().includes(searchTerm) ||
    skill.skills.some(s => s.toLowerCase().includes(searchTerm))
  );
  
  // Search in experience
  results.experience = experienceData.filter(exp => 
    exp.title.toLowerCase().includes(searchTerm) ||
    exp.company.toLowerCase().includes(searchTerm) ||
    exp.description.toLowerCase().includes(searchTerm)
  );
  
  return results;
};
