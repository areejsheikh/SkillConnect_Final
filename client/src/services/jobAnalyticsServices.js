const API_URL = 'http://localhost:5000/job-analytics'; // Replace with your actual API base URL


export const fetchViewsOnJobPosts = async (recruiterID) => {
  try {
    const response = await fetch(`${API_URL}/jobPostsViews/${recruiterID}`);
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error fetching job posts views:', responseData.message);
      throw new Error('Failed to fetch job analytics data');
    }

    const data = await response.json();
    console.log('Job posts views data:', data);
    return data; // Return raw data without processing
  } catch (error) {
    console.error('Error fetching job analytics data:', error);
    throw error;
  }
};

export const fetchScheduledInterviewsCount = async (recruiterID) => {
  try {
    const response = await fetch(`${API_URL}/scheduledInterviews/${recruiterID}`);
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error fetching scheduled interviews:', responseData.message);
      throw new Error('Failed to fetch scheduled interviews data');
    }

    const data = await response.json();
    console.log('Scheduled interviews data:', data);
    return data; // Return raw data without processing
  } catch (error) {
    console.error('Error fetching scheduled interviews data:', error);
    throw error;
  }
};

export const fetchJobsResponseRates = async (recruiterID) => {
  try {
    const response = await fetch(`${API_URL}/responseRates/${recruiterID}`);
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error fetching response rate:', responseData.message);
      throw new Error('Failed to fetch response rate data');
    }

    const data = await response.json();
    console.log('Response rate data:', data);
    return data; // Return raw data without processing
  } catch (error) {
    console.error('Error fetching response rate data:', error);
    throw error;
  }
};

export const incrementJobPostView = async (jobID) => {
  try {
    const response = await fetch(`${API_URL}/incrementView/${jobID}`, {
      method: 'GET',
    });
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error incrementing job post view:', responseData.message);
      throw new Error('Failed to increment job post view');
    }

    const data = await response.json();
    console.log('Job post view incremented successfully:', data);
    return data; // Return raw data without processing
  } catch (error) {
    console.error('Error incrementing job post view:', error);
    throw error;
  }
};

export const incrementJobApplicationsCount = async (jobID) => {
  try {
    const response = await fetch(`${API_URL}/incrementApplications/${jobID}`, {
      method: 'GET',
    });
    if (!response.ok) {
      const responseData = await response.json();
      console.error('Error incrementing job applications count:', responseData.message);
      throw new Error('Failed to increment job applications count');
    }

    const data = await response.json();
    console.log('Job applications count incremented successfully:', data);
    return data; // Return raw data without processing
  } catch (error) {
    console.error('Error incrementing job applications count:', error);
    throw error;
  }
};

export default{
  fetchViewsOnJobPosts,
  fetchScheduledInterviewsCount,
  fetchJobsResponseRates,
  incrementJobPostView,
  incrementJobApplicationsCount,
};
