import SeekerProfile from '../models/seekerProfileModel.js';
import SeekerCredentials from '../models/seekerCredentialsModel.js';
import SeekerWorkingStatus from '../models/seekerWorkingStatusModel.js';
import Users from '../models/usersModel.js';


export const getSeekerCompleteProfile = async (req, res) => {
  try {
    const userID = req.params.userID;
    console.log('Fetching complete seeker profile for userID:', userID); // Debugging line

    // Check if user exists
    const user = await Users.getUserByID(userID);
    if (!user) {
      console.log('User not found for userID:', userID); // Debugging line
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    console.log('Fetched user details:', user); // Debugging line

    // Fetch basic seeker profile
    const basicProfile = await getBasicSeekerProfile(userID);
    if (!basicProfile) {
      console.log('Basic seeker profile not found for userID:', userID); // Debugging line
      return res.status(404).json({
        success: false,
        message: 'Basic seeker profile not found',
      });
    }
    console.log('Fetched basic seeker profile:', basicProfile); // Debugging line

    // Fetch working status
    const workingStatus = await SeekerWorkingStatus.getSeekerWorkingStatus(userID);
    if (!workingStatus) {
      console.log('Seeker working status not found for userID:', userID); // Debugging line
      return res.status(404).json({
        success: false,
        message: 'Seeker working status not found',
      });
    }
    console.log('Fetched seeker working status:', workingStatus); // Debugging line

    // Fetch seeker credentials
    const seekerCredentials = await SeekerCredentials.geSeekerCredentials(userID);
    if (!seekerCredentials) {
      console.log('Seeker credentials not found for userID:', userID); // Debugging line
      return res.status(404).json({
        success: false,
        message: 'Seeker credentials not found',
      });
    }
    console.log('Fetched seeker credentials:', seekerCredentials); // Debugging line

    // Combine all data into a complete profile
    const completeProfile = {
      userID: user.userID,
      username: user.username,
      email: user.email,
      basicProfile,
      workingStatus,
      seekerCredentials,
    };
    console.log('Complete seeker profile prepared:', completeProfile); // Debugging line

    return res.status(200).json({
      success: true,
      message: 'Seeker complete profile retrieved successfully',
      data: completeProfile,
    });
  } catch (error) {
    console.error('Error in getSeekerCompleteProfile:', error); // Debugging line
    return res.status(500).json({
      success: false,
      message: 'Internal server error in getCompleteSeekerProfile',
      error: error.message,
    });
  }
};

export const createSeekerProfile = async (req, res) => {
  try {
    const { userID, firstName, lastName, email } = req.body;
    
    // Check if user exists
    const user = await Users.getUserByID(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if profile already exists
    const existingProfile = await SeekerProfile.getSeekerProfileData(userID);
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists for this user'
      });
    }
    
    // Create new profile
    const newProfile = await SeekerProfile.addBasicSeekerProfile({
      userID,
      firstName,
      lastName,
      email
    });
    
    return res.status(201).json({
      success: true,
      message: 'Seeker profile created successfully',
      data: newProfile
    });
  } catch (error) {
    console.error('Error in createSeekerProfile controller:', error);
    
    // Handle duplicate email error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error creating seeker profile',
      error: error.message
    });
  }
};


export const updateSeekerProfile = async (req, res) => {
  try {
    // Get userID from request parameters or from authenticated user
    const userID = req.params.userID || req.user.userID;
    const { firstName, lastName, email, profilePicTitle } = req.body;
    
    // Build update object with only provided fields
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (profilePicTitle) updates.profilePicTitle = profilePicTitle;
    
    // If no updates provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }
    
    // Update profile
    await SeekerProfile.updateBasicSeekerProfile(userID, updates);
    
    // Get updated profile
    const updatedProfile = await SeekerProfile.getSeekerProfileData(userID);
    
    return res.status(200).json({
      success: true,
      message: 'Seeker profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error in updateSeekerProfile controller:', error);
    
    // Handle common errors
    if (error.message === 'Profile not found or no changes made') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error updating seeker profile',
      error: error.message
    });
  }
};


export const deleteSeekerProfile = async (req, res) => {
  try {
    const userID = req.params.userID;
    
    // Check if profile exists
    const profile = await SeekerProfile.getSeekerProfileData(userID);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Seeker profile not found'
      });
    }
    
    // Delete profile (leveraging CASCADE delete with Users if needed)
    await profile.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Seeker profile deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteSeekerProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting seeker profile',
      error: error.message
    });
  }
};




const getBasicSeekerProfile = async (userID) => {
  try {
    // Get seeker profile
    const basicProfile = await SeekerProfile.getBasicSeekerProfile(userID);
    if (!basicProfile) {
      throw new Error('Basic Seeker profile not found');
    }
    
    return basicProfile;
  } 
  catch (error) {
    console.error('Error in getBasicSeekerProfile function:', error);
    throw error;
  }
};
