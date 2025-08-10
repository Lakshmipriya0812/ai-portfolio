export async function getPresentation(parameters = {}) {
  try {
    const { topic } = parameters;
    
    const presentations = [
      {
        id: "1",
        title: "AI in Modern Web Development",
        description: "Exploring the integration of AI technologies in web development workflows",
        duration: "45 minutes",
        audience: "Developers and Tech Enthusiasts",
        keyPoints: [
          "AI-powered development tools",
          "Machine learning in web applications",
          "Future of AI in web development"
        ]
      },
      {
        id: "2",
        title: "Building Scalable Applications",
        description: "Best practices for creating scalable and maintainable web applications",
        duration: "60 minutes",
        audience: "Full-stack Developers",
        keyPoints: [
          "Architecture patterns",
          "Performance optimization",
          "Database design strategies"
        ]
      },
      {
        id: "3",
        title: "Modern JavaScript Ecosystem",
        description: "Overview of current JavaScript tools, frameworks, and best practices",
        duration: "30 minutes",
        audience: "JavaScript Developers",
        keyPoints: [
          "ES6+ features",
          "Modern frameworks comparison",
          "Build tools and bundlers"
        ]
      }
    ];
    
    let filteredPresentations = presentations;
    
    if (topic) {
      filteredPresentations = presentations.filter(presentation =>
        presentation.title.toLowerCase().includes(topic.toLowerCase()) ||
        presentation.description.toLowerCase().includes(topic.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: filteredPresentations,
      type: 'presentations',
      count: filteredPresentations.length,
      message: `Retrieved ${filteredPresentations.length} presentation(s) successfully`
    };
  } catch (error) {
    console.error('Error in getPresentation tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve presentation information',
      type: 'error'
    };
  }
}
