import React, { useEffect, useState } from 'react';
import './styles/JobDetails.css';
import jobService from '../services/jobServices'; // Import jobService

const JobDetails = ({ jobPostID, setRecruiterID }) => {
  const [jobData, setJobData] = useState(null);

  // Array of available company images
  const companyImages = [
    { name: 'facebook', src: `${process.env.PUBLIC_URL}/facebook.icon.png` },
    { name: 'google', src: `${process.env.PUBLIC_URL}/google.icon.png` },
    { name: 'instagram', src: `${process.env.PUBLIC_URL}/instagram.icon.jpg` },
  ];

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await jobService.getJobDetails(jobPostID); // Fetch job details
        const jobDetails = response.data;
        console.log('Fetched Job Details:', jobDetails); // Log the fetched job details

        setJobData(jobDetails); // Set the job details in state
        setRecruiterID(jobDetails.userID); // Set recruiterID in parent state
      } catch (error) {
        console.error('Failed to fetch job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobPostID, setRecruiterID]);

  // Function to get the company logo
  const getCompanyLogo = (companyName) => {
    const matchingImage = companyImages.find((image) =>
      companyName?.toLowerCase().includes(image.name)
    );
    return matchingImage ? matchingImage.src : `${process.env.PUBLIC_URL}/logoskill.png`;
  };

  if (!jobData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-details">
      <div className="breadcrumb">
        Home / Job Postings / Job Details
      </div>

      <div className="job-header">
        <div className="company-logo">
          <img
            src={getCompanyLogo(jobData.company)} // Dynamically get the company logo
            alt="Company Logo"
          />
        </div>
        <div className="job-title-section">
          <h2>{jobData.title}</h2>
          <p className="company-name">at {jobData.company || 'Not specified'}</p>
          <span className="full-time-tag">{jobData.jobSetup || 'Not specified'}</span>
          {jobData.status === 'open' && <span className="status-tag">OPEN</span>}
        </div>
      </div>

      <div className="job-description">
        <h3>Job Description</h3>
        <p>{jobData.jobDescrip || 'No description available.'}</p>

        <h4>Responsibilities:</h4>
        <ul>
          {jobData.jobReqs
            ? jobData.jobReqs.split(',').map((item, index) => <li key={index}>{item.trim()}</li>)
            : <li>No responsibilities listed.</li>}
        </ul>

        <h4>Desirable Skills:</h4>
        <ul>
          {jobData.jobDesirables
            ? jobData.jobDesirables.split(',').map((item, index) => <li key={index}>{item.trim()}</li>)
            : <li>No desirable skills listed.</li>}
        </ul>

        <h4>Benefits:</h4>
        <ul>
          {jobData.jobBenefits
            ? jobData.jobBenefits.split(',').map((item, index) => <li key={index}>{item.trim()}</li>)
            : <li>No benefits listed.</li>}
        </ul>
      </div>
    </div>
  );
};

export default JobDetails;