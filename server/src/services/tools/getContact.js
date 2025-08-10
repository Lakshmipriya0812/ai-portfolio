import { profileData } from '../portfolioData.js';

export async function getContact(parameters = {}) {
  try {
    const { method } = parameters;
    
    const contactInfo = {
      email: profileData.email,
      github: profileData.github,
      linkedin: profileData.linkedin,
      website: profileData.website
    };
    
    if (method) {
      const methodLower = method.toLowerCase();
      
      if (methodLower === 'email') {
        return {
          success: true,
          data: { email: contactInfo.email },
          type: 'contact',
          method: 'email',
          message: 'Email contact information retrieved successfully'
        };
      } else if (methodLower === 'social') {
        return {
          success: true,
          data: {
            github: contactInfo.github,
            linkedin: contactInfo.linkedin
          },
          type: 'contact',
          method: 'social',
          message: 'Social media contact information retrieved successfully'
        };
      } else if (methodLower === 'website') {
        return {
          success: true,
          data: { website: contactInfo.website },
          type: 'contact',
          method: 'website',
          message: 'Website contact information retrieved successfully'
        };
      }
    }
    
    // Return all contact methods
    return {
      success: true,
      data: contactInfo,
      type: 'contact',
      method: 'all',
      message: 'All contact information retrieved successfully'
    };
  } catch (error) {
    console.error('Error in getContact tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve contact information',
      type: 'error'
    };
  }
}
