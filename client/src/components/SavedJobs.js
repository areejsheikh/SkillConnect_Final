import React from 'react';
import './styles/SavedJobs.css'; // Import the CSS file
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import { FaMapMarkerAlt } from 'react-icons/fa'; // Import location pin icon

// Array of available company images
const companyImages = [
  { name: 'facebook', src: `${process.env.PUBLIC_URL}/facebook.icon.png` },
  { name: 'google', src: `${process.env.PUBLIC_URL}/google.icon.png` },
  { name: 'instagram', src: `${process.env.PUBLIC_URL}/instagram.icon.jpeg` },
];

// Function to get the company logo
const getCompanyLogo = (companyName) => {
  const matchingImage = companyImages.find((image) =>
    companyName?.toLowerCase().includes(image.name)
  );
  return matchingImage ? matchingImage.src : `${process.env.PUBLIC_URL}/logoskill.png`; // Default logo
};

export default function SavedJobs({ savedJobs = [] }) {
  const navigate = useNavigate(); // Initialize navigate function
  const { userId } = useParams(); // Retrieve userId from the URL

  const handleViewDetails = (jobPostID) => {
    navigate(`/job-details/${jobPostID}/${userId}`); // Navigate to Job Details page with jobPostID and userId
  };

  return (
    <div className="saved-jobs-container">
      <h1 className="saved-jobs-heading">Saved Jobs</h1>
      <div className="saved-jobs-list">
        {savedJobs.length > 0 ? (
          savedJobs.map((job, index) => (
            <div key={index} className="saved-job-card">
              <div className="saved-job-company">
                <img
                  src={getCompanyLogo(job.company)} // Dynamically get the company logo
                  alt={`${job.company} Logo`}
                  className="company-logo"
                />
                <div>
                  <div className="company-name">{job.company}</div>
                  <div className="company-location">
                    <FaMapMarkerAlt className="location-icon" /> {/* Add location pin icon */}
                    {job.jobLocation}
                  </div>
                </div>
              </div>
              <div className="saved-job-details">
                <div className="job-role">{job.title}</div>
                <div className="job-meta">
                  <span className="job-type">
                    {job.jobSetup ? job.jobSetup.charAt(0).toUpperCase() + job.jobSetup.slice(1) : 'N/A'}
                  </span>
                  <span className="job-salary">
                    Salary: {job.salaryRange ? `$${job.salaryRange.replace('-', '-$')}` : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="saved-job-actions">
                <button
                  className="view-details-button"
                  onClick={() => handleViewDetails(job.jobPostID)} // Pass jobPostID to the handler
                >
                  View Details →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-saved-jobs">
            <p>No saved jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}