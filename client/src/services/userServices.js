const API_URL = 'http://localhost:5000/users'; // Base API URL for authentication


export const createUser = async (userData) => {
  try {
    //console.log('Creating user with data:', userData); // Debugging line
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to create user: ${responseData.message}`);
    }

    const responseData = await response.json();
    console.log('response from server:', responseData); // Debugging line
    return responseData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


export const logUserIn = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to login user : ${responseData.message}`);
    }

    const responseData = await response.json();
    console.log('response from server:', responseData); // Debugging line
    return responseData;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};


export const updateUserPassword = async (userID, passwordData) => {
  try {
    console.log('Updating password for user ID:', userID); // Debugging line
    console.log('Password data:', passwordData); // Debugging line
    userID = 2; //harcoded , front end sa dekh wha nhi aa rhi
     const response = await fetch(`${API_URL}/updatePassword/${userID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }),
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update password');
    }

    console.log('Password update response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

export default {
  createUser,
  logUserIn,
  updateUserPassword
};