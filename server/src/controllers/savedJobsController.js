import SavedJobs from '../models/savedJobsModel.js';
import JobPostings from '../models/jobPostingsModel.js';
import Users from '../models/usersModel.js';


export const getSavedJobs = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log('Fetching saved jobs for userID:', userID); // Debugging line

    //const savedJobs = await SavedJobs.findAll({ where: { userID } });
    const savedJobs = await SavedJobs.getSavedJobs(userID);
    console.log('Saved jobs fetched:', savedJobs); // Debugging line
    if (!savedJobs || savedJobs.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No saved jobs found for this user',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Saved jobs fetched successfully',
      data: savedJobs,
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error); // Debugging line
    return res.status(500).json({
      success: false,
      message: 'Error fetching saved jobs',
      error: error.message,
    });
  }
};

export const saveJob = async (req, res) => {
  try {
    // Get jobPostID from request parameters and map it to jobID
    const { jobPostID } = req.params;
    const { userID } = req.body;

    // Map jobPostID to jobID for consistency
    const jobID = jobPostID;

    // Validate input
    if (!userID || !jobID) {
      return res.status(400).json({
        message: 'User ID and Job ID are required',
      });
    }

    // Check if user exists
    const user = await Users.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Check if job exists
    const job = await JobPostings.findByPk(jobID);
    if (!job) {
      return res.status(404).json({
        message: 'This Job post does not exist',
      });
    }

    // Check if job is already saved
    const existingSavedJob = await SavedJobs.findOne({
      where: { userID, jobID },
    });

    if (existingSavedJob) {
      return res.status(409).json({
        message: 'Job has already been saved',
      });
    }

    // Save the job
    await SavedJobs.create({ userID, jobID });

    // Get updated saved jobs count
    const savedJobsCount = await SavedJobs.count({ where: { userID } });

    return res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      savedJobsCount,
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error saving job',
      error: error.message,
    });
  }
};

export const removeSavedJob = async (req, res) => {
  try {
    // Get userID from authenticated user or request parameters
    const userID = req.user ? req.user.userID : req.params.userID;
    const { jobID } = req.params;

    if (!userID || !jobID) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Job ID are required'
      });
    }

    // Remove the saved job
    await SavedJobs.removeSavedJob(userID, jobID);

    // Get updated saved jobs count
    const savedJobsCount = await SavedJobs.getSavedJobsCount(userID);

    return res.status(200).json({
      success: true,
      message: 'Job removed from saved list',
      savedJobsCount
    });
  } catch (error) {
    if (error.message === 'Saved job not found or already removed') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error removing saved job',
      error: error.message
    });
  }
};

export const checkSavedJob = async (req, res) => {
  try {
    const userID = req.user ? req.user.userID : req.params.userID;
    const { jobID } = req.params;

    if (!userID || !jobID) {
      return res.status(400).json({
        success: false,
        message: 'User ID and Job ID are required'
      });
    }

    // Check if job is saved
    const savedJob = await SavedJobs.findOne({
      where: { userID, jobID }
    });

    return res.status(200).json({
      success: true,
      isSaved: !!savedJob
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking saved job status',
      error: error.message
    });
  }
};