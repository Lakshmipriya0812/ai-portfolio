import { experienceData, profileData, skillsData } from '../portfolioData.js';

export async function getResume(parameters = {}) {
  try {
    const { format = 'summary' } = parameters;
    
    if (format === 'detailed') {
      return {
        success: true,
        data: {
          profile: profileData,
          experience: experienceData,
          skills: skillsData
        },
        type: 'resume',
        format: 'detailed',
        message: 'Detailed resume information retrieved successfully'
      };
    }
    
    // Return summary format
    const summaryResume = {
      name: profileData.name,
      title: profileData.title,
      experience: experienceData.map(exp => ({
        title: exp.title,
        company: exp.company,
        duration: exp.duration
      })),
      skills: skillsData.map(skill => ({
        category: skill.category,
        count: skill.skills.length
      }))
    };
    
    return {
      success: true,
      data: summaryResume,
      type: 'resume',
      format: 'summary',
      message: 'Resume summary retrieved successfully'
    };
  } catch (error) {
    console.error('Error in getResume tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve resume information',
      type: 'error'
    };
  }
}
