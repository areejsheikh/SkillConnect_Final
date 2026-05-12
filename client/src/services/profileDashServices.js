const API_URL = 'http://localhost:5000/seekerdash'; // Replace with your backend API URL

/**
 * Fetch seeker dashboard data by user ID
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} - Seeker dashboard data + jobs applied with status 'applied'
 */
export const getSeekerDashData = async (userID) => {
  try {
    // console.log('Fetching seeker dashboard data for user ID:', userID);
    const response = await fetch(`${API_URL}/getDash/${userID}`);
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Failed to fetch dash data: ', responseData.message);
      throw new Error(responseData.message);
    }
    // console.log('Dash Data from server for user:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching seeker dashboard data:', error);
    throw error;
  }
};

/**
 * Fetch user data for profile settings
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} - User data
 */
export const getSeekerAllAppliedJobs = async (userID) => {
  try {
    // console.log('Fetching all applied jobs for user ID:', userID);
    const response = await fetch(`${API_URL}/getAllAppliedJobs/${userID}`);
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Failed to fetch user applied jobs: ', responseData.message);
      throw new Error(responseData.message);
    }
    // console.log('All Apllied jobs of user from server:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error fetching all user applied jobs data:', error);
    throw error;
  }
};

/**
 * Fetch all saved jobs of a user
 * @param {number} userId - The ID of the user
 * @returns {Promise<Object>} - Saved jobs data
 */
export const getSeekerAllSavedJobs = async (userID) => {
  try {
    // console.log('Fetching all saved jobs for user ID:', userID); // Debugging line
    const response = await fetch(`${API_URL}/getSavedJobs/${userID}`);
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Failed to fetch user saved jobs: ', responseData.message); // Debugging line
      throw new Error(responseData.message || 'Failed to fetch saved jobs');
    }
    const responseData = await response.json();
    console.log('All Saved jobs of user from server:', responseData); // Debugging line
    return responseData;
  } catch (error) {
    console.error('Error fetching all user saved jobs data:', error); // Debugging line
    throw error;
  }
};


export const getSeekerCompleteProfile = async (userID) => {
  try {
    console.log('Fetching complete seeker profile for user ID:', userID); // Debugging line
    const response = await fetch(`${API_URL}/getProfile/${userID}`);
    const responseData = await response.json();
    if (!response.ok) {
      console.error('Failed to fetch complete seeker profile: ', responseData.message); // Debugging line
      throw new Error(responseData.message || 'Failed to fetch seeker profile');
    }
    console.log('Seeker profile data from server:', responseData); // Debugging line
    return responseData;
  } catch (error) {
    console.error('Error fetching seeker profile data:', error); // Debugging line
    throw error;
  }
};



// /**
//  * Update user data
//  * @param {number} userId - The ID of the user
//  * @param {Object} updatedData - The updated user data
//  * @returns {Promise<void>}
//  */
// export const updateUserData = async (userId, updatedData) => {
//   try {
//     const response = await fetch(`${API_URL}/users/update/${userId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updatedData),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to update user data');
//     }
//   } catch (error) {
//     console.error('Error updating user data:', error);
//     throw error;
//   }
// };

export default {
  getSeekerDashData,
  getSeekerAllAppliedJobs, 
  getSeekerAllSavedJobs,
  getSeekerCompleteProfile
  //getUserProfile,
  //getUserData,
  //updateUserData,
};