export async function getInternship(parameters = {}) {
  try {
    const { company, duration } = parameters;
    
    const internships = [
      {
        id: "1",
        title: "Software Development Intern",
        company: "TechCorp Solutions",
        duration: "3 months",
        location: "Chennai, India",
        description: "Worked on developing web applications using React and Node.js. Collaborated with senior developers on real-world projects.",
        technologies: ["React", "Node.js", "MongoDB", "Git"],
        achievements: [
          "Developed 3 new features for the main product",
          "Improved application performance by 25%",
          "Received excellent feedback from team lead"
        ]
      },
      {
        id: "2",
        title: "AI/ML Research Intern",
        company: "InnovateAI Labs",
        duration: "6 months",
        location: "Bangalore, India",
        description: "Researched and implemented machine learning algorithms for natural language processing. Published findings in company blog.",
        technologies: ["Python", "TensorFlow", "NLP", "Data Analysis"],
        achievements: [
          "Implemented 2 new NLP models",
          "Reduced processing time by 40%",
          "Presented research findings to the team"
        ]
      },
      {
        id: "3",
        title: "Frontend Development Intern",
        company: "WebFlow Studios",
        duration: "4 months",
        location: "Remote",
        description: "Built responsive user interfaces and improved user experience for web applications. Worked with modern frontend technologies.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
        achievements: [
          "Created 5 new UI components",
          "Improved website accessibility score",
          "Reduced bundle size by 15%"
        ]
      }
    ];
    
    let filteredInternships = internships;
    
    // Filter by company if specified
    if (company) {
      filteredInternships = filteredInternships.filter(internship =>
        internship.company.toLowerCase().includes(company.toLowerCase())
      );
    }
    
    // Filter by duration if specified
    if (duration) {
      filteredInternships = filteredInternships.filter(internship =>
        internship.duration.toLowerCase().includes(duration.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: filteredInternships,
      type: 'internships',
      count: filteredInternships.length,
      message: `Retrieved ${filteredInternships.length} internship(s) successfully`
    };
  } catch (error) {
    console.error('Error in getInternship tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve internship information',
      type: 'error'
    };
  }
}
