import { projectsData, getProjectsByTechnology } from '../portfolioData.js';

export async function getProjects(parameters = {}) {
  try {
    const { technology, limit, category } = parameters;
    
    let filteredProjects = [...projectsData];
    
    // Filter by technology if specified
    if (technology) {
      filteredProjects = filteredProjects.filter(project =>
        project.technologies.some(tech => 
          tech.toLowerCase().includes(technology.toLowerCase())
        )
      );
    }
    
    // Filter by category if specified
    if (category) {
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(category.toLowerCase()) ||
        project.description.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Apply limit if specified
    if (limit && typeof limit === 'number') {
      filteredProjects = filteredProjects.slice(0, limit);
    }
    
    return {
      success: true,
      data: filteredProjects,
      type: 'projects',
      count: filteredProjects.length,
      message: `Retrieved ${filteredProjects.length} project(s) successfully`
    };
  } catch (error) {
    console.error('Error in getProjects tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve project information',
      type: 'error'
    };
  }
}
