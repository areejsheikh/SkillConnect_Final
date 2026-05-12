import appliedJobs from "../models/appliedJobsModel.js";
import JobPostings from "../models/jobPostingsModel.js";
import SeekerProfile from '../models/seekerProfileModel.js';
import SeekerWorkingStatus from '../models/seekerWorkingStatusModel.js';
import SeekerCredentials from "../models/seekerCredentialsModel.js";
import JobAnalytics from "../models/jobAnalyticsModel.js";

import {formatApplicantsForPostData} from '../utils/formatObjects.js'

export const applyToJob = async (req, res) => {
  try {
    const { applicantID, recruiterID, jobPostID } = req.body;

    // Ensure jobPostID is not null
    if (!jobPostID) {
      return res.status(400).json({ message: "jobPostID is required" });
    }

    // Check if the job exists in the jobPostings table
    const jobExists = await JobPostings.getJobById(jobPostID);
    if (!jobExists) {
      return res.status(404).json({ message: "There is no such job post" });
    }

    // Check if the user has already applied to this job
    const alreadyApplied = await appliedJobs.checkIfAlreadyApplied(applicantID, jobPostID);
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    console.log("User has not applied to this job yet");
    // Map jobPostID to jobID for the database
    const newApplication = await appliedJobs.create({
      applicantID,
      recruiterID,
      jobID: jobPostID, // Correctly map jobPostID to jobID
    });

    if (!newApplication) {
      return res.status(500).json({ message: "Failed to apply to job" });
    }
    console.log("New application created successfully:", newApplication);
    // const isIncremented = await JobAnalytics.incrementJobApplications(jobID);
    // if (!isIncremented) {
    //   console.log("Failed to increment job applications count");
    // }
    // console.log("Job applications count also incremented successfully");

    res.status(201).json({ message: "Application submitted successfully", data: newApplication });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to apply to job" });
  }
};

export const getUserApplications = async (req, res) => {
  try {
    const { userID } = req.params;
    const applications = await appliedJobs.getAppliedJobsOfUser(userID);
    res.status(200).json({ data: applications, message: "Applications fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobID } = req.params;
    if (!jobID) {
      return res.status(400).json({ message: "Missing jobID in request parameters." });
    }
    
    const applicantsReferences  = await appliedJobs.getApplicantsForRecruiterPost(jobID);

    if (!applicantsReferences || applicantsReferences.length === 0) {
      return res.status(404).json({ message: "No applicants found for this job post" });
    }
    const applicantIDs = applicantsReferences.map(app => app.applicantID);
    const applicationDetails = applicantsReferences.map(item => item.dataValues);
    //console.log("Applicants Details:", applicationDetails);
    console.log("\n");

    const basicDatasOfApplicants = await getBasicApplicantsData(applicantIDs);
    if(!basicDatasOfApplicants) {
      return res.status(404).json({ message: "Unable to fetch applicants data" });
    }
    
    const workingStatusesOfApplicants = await getWorkingStatusOfApplicants(applicantIDs);
    if(!workingStatusesOfApplicants) {
      return res.status(404).json({ message: "Unable to fetch the working status of applicants" });
    }
    
    const applicantsCredentials = await getApplicantsCredentials(applicantIDs);
    if(!applicantsCredentials) {  
      return res.status(404).json({ message: "Unable to fetch the credentials of applicants" });
    }
    

    // console.log("Basic Data of Applicants:", basicDatasOfApplicants); 
    // console.log("Working Status of Applicants:", workingStatusesOfApplicants);
    // console.log("Credentials of Applicants:", applicantsCredentials);

    const completeApplicantsData = formatApplicantsForPostData(basicDatasOfApplicants, workingStatusesOfApplicants, applicantsCredentials, applicationDetails);

    //console.log("Complete Applicants Data:", completeApplicantsData);

    res.status(200).json({ message: "Fetched Applicants for jobPost" , data: completeApplicantsData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error : Failed to fetch applicants for this post" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { jobID , applicationStatus } = req.body;
    const { applicantID } = req.params;
    const updated = await appliedJobs.updateApplicationStatus(applicantID, jobID, applicationStatus);
    res.status(200).json({ 
      sucess: true,
      message: `Application status updated to ${applicationStatus} successfully for jobID: ${jobID}`, 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update application status" });
  }
};





const getBasicApplicantsData = async (applicantIDs) => {
  try {
    // Get seeker profile
    const applicantsDetails = await SeekerProfile.getBasicDataOfApplicants(applicantIDs);
    if (!applicantsDetails) {
      throw new Error('Unable to fetch Basic Applicants Datas');
    }
     // Map through the applicants and include userID in the object
     const applicantsDetailsMap = applicantsDetails.map(applicant => {
      const applicantData = applicant.dataValues; // Access the dataValues
      return {
        ...applicantData, // Include the data from dataValues
      };
    });
    //console.log("Applicants Details Map:", applicantsDetailsMap);
    return applicantsDetailsMap;
  } 
  catch (error) {
    console.error('Error in getBasicApplicantsData function:', error);
    throw error;
  }
};
const getWorkingStatusOfApplicants = async (applicantIDs) => {
  try {
    // Get seeker profile
    const applicantsDetails = await SeekerWorkingStatus.getWorkingStatusOfApplicants(applicantIDs);
    if (!applicantsDetails) {
      throw new Error('Unable to fetch working Statuses Of Applicants');
    }
    
      const applicantsWorkingDeetsMap = applicantsDetails.map(applicant => {
      const applicantData = applicant.dataValues; // Access the dataValues
      return {
        ...applicantData, // Include the data from dataValues
      };
    });
    //console.log("Applicants Details Map:", applicantsWorkingDeetsMap);
    return applicantsWorkingDeetsMap;
  } 
  catch (error) {
    console.error('Error in get Working Status Of Applicants function:', error);
    throw error;
  }
};
const getApplicantsCredentials = async (applicantIDs) => {
  try {
    // Get seeker profile
    const applicantsCredentials = await SeekerCredentials.getSeekerCredentialsOfApplicants(applicantIDs);
    if (!applicantsCredentials) {
      throw new Error('Unable to fetch Credentials Of Applicants');
    }
    const applicantsCredentialsMap = applicantsCredentials.map(applicant => {
      const applicantData = applicant.dataValues; 
      return {
        ...applicantData,
      };
    });
    //console.log("Applicants Details Map:", applicantsCredentialsMap);
    return applicantsCredentialsMap;
  } 
  catch (error) {
    console.error('Error in get credentials Of Applicants function:', error);
    throw error;
  }
};

