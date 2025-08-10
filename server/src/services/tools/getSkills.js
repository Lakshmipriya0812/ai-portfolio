import { skillsData, getSkillsByCategory } from '../portfolioData.js';

export async function getSkills(parameters = {}) {
  try {
    const { category, proficiency } = parameters;
    
    let filteredSkills = [...skillsData];
    
    // Filter by category if specified
    if (category) {
      filteredSkills = filteredSkills.filter(skill =>
        skill.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    // Filter by proficiency if specified
    if (proficiency) {
      filteredSkills = filteredSkills.filter(skill =>
        skill.proficiency.toLowerCase() === proficiency.toLowerCase()
      );
    }
    
    return {
      success: true,
      data: filteredSkills,
      type: 'skills',
      count: filteredSkills.length,
      message: `Retrieved ${filteredSkills.length} skill category(ies) successfully`
    };
  } catch (error) {
    console.error('Error in getSkills tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve skills information',
      type: 'error'
    };
  }
}
