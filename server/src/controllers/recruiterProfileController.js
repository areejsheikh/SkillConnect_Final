import RecruiterProfile from '../models/recruiterProfileModel.js';
import Users from '../models/usersModel.js';


export const getRecruiterProfile = async (req, res) => {
  try {
    // Get userID from request parameters or from authenticated user
    const userID = req.params.userID || req.user.userID;
    
    // Check if user exists and is a recruiter
    const user = await Users.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get recruiter profile
    const profile = await RecruiterProfile.getRecruiterProfileData(userID);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in getRecruiterProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching recruiter profile',
      error: error.message
    });
  }
};


export const createRecruiterProfile = async (req, res) => {
  try {
    const { userID, firstName, lastName, contactNum, city, country } = req.body;
    
    // Check if user exists
    const user = await Users.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if profile already exists
    const existingProfile = await RecruiterProfile.getRecruiterProfileData(userID);
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists for this user'
      });
    }
    
    // Create new profile with only required fields
    const profileData = {
      userID,
      firstName,
      lastName
    };
    
    // Add optional fields if provided
    if (contactNum) profileData.contactNum = contactNum;
    if (city) profileData.city = city;
    if (country) profileData.country = country;
    
    const newProfile = await RecruiterProfile.addBasicRecruiterProfile(profileData);
    
    return res.status(201).json({
      success: true,
      message: 'Recruiter profile created successfully',
      data: newProfile
    });
  } catch (error) {
    console.error('Error in createRecruiterProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating recruiter profile',
      error: error.message
    });
  }
};


export const updateRecruiterProfile = async (req, res) => {
  try {
    // Get userID from request parameters or from authenticated user
    const userID = req.params.userID || req.user.userID;
    const { firstName, lastName, contactNum, city, country, profilePicTitle } = req.body;
    
    // Build update object with only provided fields
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (contactNum !== undefined) updates.contactNum = contactNum;
    if (city !== undefined) updates.city = city;
    if (country !== undefined) updates.country = country;
    if (profilePicTitle) updates.profilePicTitle = profilePicTitle;
    
    // If no updates provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No update data provided'
      });
    }
    
    // Update profile
    await RecruiterProfile.updateRecruiterProfile(userID, updates);
    
    // Get updated profile
    const updatedProfile = await RecruiterProfile.getRecruiterProfileData(userID);
    
    return res.status(200).json({
      success: true,
      message: 'Recruiter profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    console.error('Error in updateRecruiterProfile controller:', error);
    
    // Handle profile not found error
    if (error.message === 'Profile not found or no changes made') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error updating recruiter profile',
      error: error.message
    });
  }
};


export const deleteRecruiterProfile = async (req, res) => {
  try {
    const userID = req.params.userID || req.user.userID;
    
    // Check if profile exists
    const profile = await RecruiterProfile.getRecruiterProfileData(userID);
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter profile not found'
      });
    }
    
    // Delete profile (will cascade delete in the database)
    await profile.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Recruiter profile deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteRecruiterProfile controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting recruiter profile',
      error: error.message
    });
  }
};