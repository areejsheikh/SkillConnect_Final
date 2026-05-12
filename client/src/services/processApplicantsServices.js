const API_URL = 'http://localhost:5000/processApplicants'; // Replace with your actual API base URL



/**
 * Schedule an interview for an applicant.
 * Sends the necessary data to the backend to schedule an interview.
 * @param {string} applicantId - The ID of the applicant.
 * @param {Object} interviewDetails - Data required for scheduling (e.g., date, time).
 * @returns {Promise<Object>} - The response from the server.
 */
//i.e accept applicant
//interview details object should be like:
// Sample data for testing of schedule interview
// const applicationData = {
//   jobID: 1, 
//   scheduled_at: "2025-05-10 14:30:00", //note only this date format is OK
//   mode: "online",
//   notes: "anananan"
// };
export const scheduleInterview = async (applicantID, interviewDetails) => {
  try {
    //console.log('Interview details:', interviewDetails); // Log the interview details for debugging
    const response = await fetch(`${API_URL}/interview/${applicantID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interviewDetails),
    });
    if (!response.ok) {
      const responseData = await response.json();
      console.log('Response data from scheduleInterview:', responseData.message); // Log the response data for debugging
      throw new Error('Failed to schedule interview');
    }
    return await response.json(); // Return the response from the server
  } catch (error) {
    console.error('Error scheduling interview:', error);
    throw error;
  }
};


/**
 * Reject an applicant.
 * Sends the necessary data to the backend to reject the applicant.
 * @param {string} applicantId - The ID of the applicant.
 * @param {Object} rejectionData - Data required for rejection (e.g., reason).
 * @returns {Promise<Object>} - The response from the server.
 */
export const rejectApplicant = async (jobID, applicantID) => {
  try {
    const response = await fetch(`${API_URL}/reject/${applicantID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobID , applicationStatus: 'Rejected'}), // Sending job for which applicant is rejected
    }
);
    if (!response.ok) {
      const responseData = await response.json();
      console.log('Response data from scheduleInterview:', responseData.message);
      throw new Error('Failed to reject applicant');
    }
    return await response.json(); // Return the response from the server
  } catch (error) {
    console.error('Error rejecting applicant:', error);
    throw error;
  }
};

/**
 * Fetch all potential applicants for a searching page.
 * Retrieves a list of all jobseekers
 */
export const fetchAllPotentialApplicants = async () => {
  try {
    const response = await fetch(`${API_URL}/potentialApplicants`, {
      method: 'GET',
    });

    if (!response.ok) {
      const responseData = await response.json();
      console.log('Response data from fetchPotentialApplicants:', responseData.message);
      throw new Error('Failed to fetch potential applicants');
    }
    return await response.json(); // Return the list of applicants from the server
  } catch (error) {
    console.error('Error fetching potential applicants:', error);
    throw error;
  }
};
