const API_URL = 'http://localhost:5000/manageJobs'; // Replace with your backend API base URL

/**
 * Fetch all jobs posted by a specific recruiter
 * @param {string} recruiterId - The ID of the recruiter
 * @returns {Promise<Array>} - List of jobs posted by the recruiter
 */
const getJobsByRecruiter = async (recruiterID) => {
  console.log('Fetching jobs for recruiter:', recruiterID);
  try {
    const response = await fetch(`${API_URL}/getJobPosts/${recruiterID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to fetch jobs: ${responseData.message}`);
    }

    const jobs = await response.json();
    console.log('Jobs posted by recruiter fetched successfully:', jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs by recruiter:', error);
    throw error;
  }
};

//need object with attribut names like this to send for jobPost
// const jobPosting = {
//   userID: 2, // recruiterID
//   title: "Frontend Developer",
//   company: "TechNova Solutions",
//   jobDescrip: "We are looking for a talented Frontend Developer",
//   jobReqs: "Proficient in HTML, CSS",
//   jobDesirables: "Familiarity with TypeScript",
//   jobBenefits: "Health insurance.",
//   jobLocation: "USA",
//   salaryRange: "70,000 - 90,000",
//   jobSetup: "remote",
//   eduReq: "PHD",
//   jobLevel: "Mid-Level"
// };

const postJob = async (recruiterID, newJobData) => {
  try {
    const response = await fetch(`${API_URL}/postJob/${recruiterID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newJobData),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`Failed to post job: ${responseData.message}`);
    }

    const createdJob = await response.json();
    return createdJob;
  } catch (error) {
    console.error('Error posting job:', error);
    throw error;
  }
};

/**
 * Fetch all applicants for a specific job
 * @param {string} jobId - The ID of the job
 * @returns {Promise<Array>} - List of applicants for the job
 */
const getAllApplicantsDetailsForJob = async (jobID) => {
  try {
    const response = await fetch(`${API_URL}/applicants/${jobID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.log('Response data from getApplicantsALLforPost:', responseData); // Log the response data for debugging
      throw new Error(`Failed to fetch applicants: ${responseData.message}`);
    }

    const applicants = await response.json();
    return applicants;
  } catch (error) {
    console.error('Error fetching applicants by job:', error);
    throw error;
  }
};


export default {
  getJobsByRecruiter,
  postJob,
  getAllApplicantsDetailsForJob,
};