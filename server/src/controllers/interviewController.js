import Interviews from '../models/interviewsModel.js';
import AppliedJobs from '../models/appliedJobsModel.js';


export const scheduleInterview = async (req, res) => {
  try {
    const interviewDetails = req.body;
    //console.log('Interview details:', interviewDetails); // Log the interview details for debugging
    const { applicantID } = req.params; // Extracting applicantID from the request parameters
    //this object should have attributes: appliedID,scheduled_at,mode,notes
    // Check if applied job exists
    const applicationID = await AppliedJobs.getApplicationIDforUser(applicantID, interviewDetails.jobID);
    if (!applicationID) {
      return res.status(404).json({ success: false, message: 'User Application to job not found' });
    }
    
    const interviewObject = {
      appliedID: applicationID,
      scheduled_at: interviewDetails.scheduled_at,
      mode: interviewDetails.mode,
      notes: interviewDetails.notes
    };

    // Create the interview
    const newInterview = await Interviews.scheduleInterview(interviewObject);
    if (!newInterview) {  
      return res.status(500).json({ success: false, message: 'Error scheduling interview' });
    }
    
    // Update the application status to 'interviewed'
    const isApplicationUpdated = await AppliedJobs.update(
      { status: 'Interview Scheduled' },             
      { where: { appliedID: applicationID } }        
    );
    if (!isApplicationUpdated) {    
      return res.status(500).json({ success: false, message: 'Error updating application status to scheduled' });
    }

    return res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: newInterview
    });
  } catch (error) {
    console.error('Error in scheduleInterview controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error scheduling interview',
      error: error.message
    });
  }
};


export const updateInterview = async (req, res) => {
  try {
    const { interviewID } = req.params;
    const updates = req.body;
    
    // Remove any fields that shouldn't be updated
    delete updates.interviewID;
    delete updates.appliedID; // Prevent changing the association
    
    // Update the interview
    await Interviews.updateInterview(interviewID, updates);
    
    // Get the updated interview
    const updatedInterview = await Interviews.findByPk(interviewID);
    if (!updatedInterview) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: updatedInterview
    });
  } catch (error) {
    console.error('Error in updateInterview controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating interview',
      error: error.message
    });
  }
};


export const cancelInterview = async (req, res) => {
  try {
    const { interviewID } = req.params;
    
    await Interviews.cancelInterview(interviewID);
    
    return res.status(200).json({
      success: true,
      message: 'Interview cancelled successfully'
    });
  } catch (error) {
    console.error('Error in cancelInterview controller:', error);
    
    if (error.message === 'Interview not found or already cancelled') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error cancelling interview',
      error: error.message
    });
  }
};


export const getInterviewDetails = async (req, res) => {
  try {
    const { interviewID } = req.params;
    
    const interview = await Interviews.findByPk(interviewID, {
      include: [{
        model: AppliedJobs,
        attributes: ['appliedID', 'jobID', 'userID', 'status', 'applied_date']
      }]
    });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Error in getInterviewDetails controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching interview details',
      error: error.message
    });
  }
};


export const getInterviewsByApplication = async (req, res) => {
  try {
    const { appliedID } = req.params;
    
    const interviews = await Interviews.findAll({
      where: { appliedID },
      order: [['scheduled_at', 'DESC']]
    });
    
    return res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    console.error('Error in getInterviewsByApplication controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};


export const getUpcomingInterviewsByUser = async (req, res) => {
  try {
    const { userID } = req.params;
    
    // Find all interviews for applications by this user
    const interviews = await Interviews.findAll({
      include: [{
        model: AppliedJobs,
        where: { userID },
        attributes: ['appliedID', 'jobID', 'status']
      }],
      where: {
        status: 'scheduled',
        scheduled_at: {
          [Op.gte]: new Date() // Only future interviews
        }
      },
      order: [['scheduled_at', 'ASC']]
    });
    
    return res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    console.error('Error in getUpcomingInterviewsByUser controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching upcoming interviews',
      error: error.message
    });
  }
};