import { profileData } from '../portfolioData.js';

export async function getProfile(parameters = {}) {
  try {
    const { includeDetails = false } = parameters;
    
    if (includeDetails) {
      return {
        success: true,
        data: profileData,
        type: 'profile',
        message: 'Profile information retrieved successfully'
      };
    }
    
    // Return basic profile info
    const basicProfile = {
      name: profileData.name,
      title: profileData.title,
      location: profileData.location,
      about: profileData.about
    };
    
    return {
      success: true,
      data: basicProfile,
      type: 'profile',
      message: 'Basic profile information retrieved successfully'
    };
  } catch (error) {
    console.error('Error in getProfile tool:', error);
    return {
      success: false,
      error: 'Failed to retrieve profile information',
      type: 'error'
    };
  }
}
