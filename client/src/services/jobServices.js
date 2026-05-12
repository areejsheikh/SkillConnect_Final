// src/services/jobService.js

const API_URL = 'http://localhost:5000/jobs'; // Adjust based on your backend route


//ALL FUNCTIONS HERE TESTED

/**
 * Fetch all job postings
 * @returns {Promise<Array>} - List of job objects from the backend
 */
const getAllJobs = async () => {
  try {
    //console.log('In service: Fetching all jobs...');
    const response = await fetch(`${API_URL}/getAllJobs`);
    if (!response.ok) {
      const responseData = await response.json();
      console.error('In service: Failed to fetch jobs:', responseData.message);
      throw new Error(`Failed to fetch jobs: ${responseData.message}`);
    }
    const responseData = await response.json();
    const jobs = responseData.data;
    //console.log('In service: Jobs fetched successfully:', jobs);
    return jobs;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch details of a specific job
 * @param {string} jobId - ID of the job to fetch details for
 * @returns {Promise<Object>} - Job details object
 */
const getJobDetails = async (jobPostID) => {
  try {
    const response = await fetch(`${API_URL}/getJob/${jobPostID}`);
    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to fetch jobs: ${responseData.message}`);
    }
    const jobDetails = await response.json();
    return jobDetails;
  } catch (error) {
    throw error;
  }
};

/**
 * Apply for a job
 * @param {string} jobId - ID of the job to apply for
 * @param {Object} applicantData - Applicant's data for the application
 * @returns {Promise<Object>} - Response from the server
 */
const applyToJob = async (jobPostID, applicantData) => {
  try {
    const response = await fetch(`${API_URL}/apply/${jobPostID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicantData),
    });
    if (!response.ok) {
      const responseData = await response.json();
      console.log('In service: Failed to apply to job:', responseData.message);
      throw new Error(`Failed to apply to job: ${responseData.message}`);
    }
    const result = await response.json();
    console.log('In service: Job application successful:', result);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Save a job (bookmark it)
 * @param {string} jobID - ID of the job to save
 * @param {string} userID - ID of the user saving the job
 * @returns {Promise<Object>} - Response from the server
 */
const saveJob = async (jobID, userID) => {
  try {
    // if (!jobID || !userID) {
    //   throw new Error('jobID and userID are required to save a job');
    // }

    const response = await fetch(`${API_URL}/save/${jobID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userID }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to save job: ${responseData.message}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a sharable link for a job
 * @param {string} jobId - ID of the job
 * @returns {string} - Sharable job link
 */
const getSharableJobLink = (jobId) => {
  return `${window.location.origin}/job-details/${jobId}`;
};

export default {
  getAllJobs,
  getJobDetails,
  applyToJob,
  saveJob,
  getSharableJobLink,
};
