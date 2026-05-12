import JobAnalytics from '../models/jobAnalyticsModel.js';
import JobPostings from '../models/jobPostingsModel.js';
import Users from '../models/usersModel.js';
import appliedJobs from '../models/appliedJobsModel.js';


export const incrementJobViews = async (req, res) => {
  try {
    const { jobID } = req.params;
    
    // Check if job exists
    const job = await JobPostings.findByPk(jobID);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }
    
    // Increment view count
    await JobAnalytics.incrementJobViews(jobID);
    
    return res.status(200).json({
      success: true,
      message: 'Job view count incremented'
    });
  } catch (error) {
    console.error('Error in incrementJobViews controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error incrementing job views',
      error: error.message
    });
  }
};

export const incrementJobApplications = async (req, res) => {
  try {
    const { jobID } = req.params;
    
    // Check if job exists
    const job = await JobPostings.findByPk(jobID);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }
    
    // Increment application count
    await JobAnalytics.incrementJobApplications(jobID);
    
    return res.status(200).json({
      success: true,
      message: 'Job application count incremented'
    });
  } catch (error) {
    console.error('Error in incrementJobApplications controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error incrementing job applications',
      error: error.message
    });
  }
};

export const getJobPostViews = async (req, res) => {
  try {
    const { recruiterID } = req.params;
    
    // Check if recruiter exists
    const recruiter = await Users.findByPk(recruiterID);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    
    // Get job views for the recruiter
    const jobViews = await JobAnalytics.getJobViewsByRecruiterID(recruiterID);
    if (!jobViews || jobViews.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No job views found for this recruiter'
      });
    } 

    return res.status(200).json({
      success: true,
      data: jobViews
    });
  } catch (error) {
    console.error('Error in getJobPostViews controller:', error);
    return res.status(500).json({
      success: false,   
      message: 'Error fetching job views',
      error: error.message  
    });
  }
};

export const getScheduledInterviews = async (req, res) => {
  try {
    const { recruiterID } = req.params;
    
    // Check if recruiter exists
    const recruiter = await Users.findByPk(recruiterID);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }
    //get applied jobs for the recruiter
    const appliedJobsList = await appliedJobs.findAll({
      where: { recruiterID },
      attributes: ['appliedID']
    });
    if (!appliedJobsList || appliedJobsList.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No jobs posted by this recruiter have been applied to hence no interviews scheduled'
      });
    }
    console.log('appliedJobsList:', appliedJobsList);

    const appliedIDs = appliedJobsList.map(job => job.dataValues.appliedID);
    console.log('appliedIDs:', appliedIDs);
    // Get scheduled interviews for the recruiter
    const scheduledInterviewsCount = await JobAnalytics.getScheduledInterviewsOfRecruiter(appliedIDs);
    if (!scheduledInterviewsCount) {
      return res.status(404).json({ 
        success: false,
        message: 'No scheduled interviews found for this recruiter'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: scheduledInterviewsCount
    });
  }
  catch (error) {
    console.error('Error in getScheduledInterviews controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching scheduled interviews',
      error: error.message  
    });
  }
};

export const getJobResponseRate = async (req, res) => {
  try {
    const { recruiterID } = req.params;

    // Check if recruiter exists
    const recruiter = await Users.findByPk(recruiterID);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    // Fetch response rate data
    const jobViews = await JobAnalytics.getJobViewsByRecruiterID(recruiterID);
    const jobApplications = await JobAnalytics.getJobApplicationsByRecruiterID(recruiterID);
    if (!jobViews || jobViews.length === 0 || !jobApplications || jobApplications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Unable to proivde response rates of JobPost , No job views or applications found for this recruiter'
      });
    }

    const responseRateData = jobViews.map((view) => {
      const matchingApplication = jobApplications.find(app => app.jobID === view.jobID);
      const applications = matchingApplication ? matchingApplication.applications : 0;
    
      const responseRate = view.views > 0
        ? ((applications / view.views) * 100).toFixed(2)
        : 0;
    
      return {
        jobID: view.jobID,
        views: view.views,
        applications: applications,
        responseRate: parseFloat(responseRate)
      };
    });
    


    return res.status(200).json({
      success: true,
      data: responseRateData
    });
  } catch (error) {
    console.error('Error in getJobResponseRate controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching job response rate',
      error: error.message
    });
  }
};

export const getUserJobsAnalytics = async (req, res) => {
  try {
    // Get userID from request parameters or from authenticated user
    const userID = req.params.userID;
    
    // Check if user exists
    const user = await Users.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if requesting user has appropriate permissions
    if (req.user && req.user.userID !== userID) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to access this user analytics'
      });
    }
    
    // Get analytics summary
    const analyticsSummary = await JobAnalytics.getAnalyticsSummary(userID);
    
    // Get associated job titles for better context
    const enrichedAnalytics = await Promise.all(analyticsSummary.map(async (item) => {
      const job = await JobPostings.findByPk(item.jobID, {
        attributes: ['title']
      });
      
      // Calculate conversion rate
      const conversionRate = item.views > 0 
        ? ((item.applications / item.views) * 100).toFixed(2) 
        : 0;
      
      return {
        ...item.dataValues,
        jobTitle: job ? job.title : 'Unknown Job',
        conversionRate: parseFloat(conversionRate)
      };
    }));
    
    return res.status(200).json({
      success: true,
      data: enrichedAnalytics
    });
  } catch (error) {
    console.error('Error in getUserJobsAnalytics controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user jobs analytics',
      error: error.message
    });
  }
};

export const initializeJobAnalytics = async (req, res) => {
  try {
    const { jobID, userID } = req.body;
    
    // Check if job exists
    const job = await JobPostings.findByPk(jobID);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found'
      });
    }
    
    // Check if user exists
    const user = await Users.findByPk(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if analytics entry already exists
    const existingAnalytics = await JobAnalytics.findOne({
      where: { jobID, userID }
    });
    
    if (existingAnalytics) {
      return res.status(409).json({
        success: false,
        message: 'Analytics entry already exists for this job'
      });
    }
    
    // Create new analytics entry
    const newAnalytics = await JobAnalytics.create({
      jobID,
      userID,
      views: 0,
      applications: 0,
      last_updated: new Date()
    });
    
    return res.status(201).json({
      success: true,
      message: 'Job analytics initialized successfully',
      data: newAnalytics
    });
  } catch (error) {
    console.error('Error in initializeJobAnalytics controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error initializing job analytics',
      error: error.message
    });
  }
};
