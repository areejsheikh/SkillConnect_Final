import React, { useState } from 'react';
import './styles/AppliedJobs.css'; // Import the CSS file
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import { FaMapMarkerAlt } from 'react-icons/fa'; // Import location pin icon
import Popup from './Popup'; // Import the Popup component

const statusColors = {
  'UNDER REVIEW': 'status-yellow',
  'ACTIVE': 'status-green',
  'EXPIRED': 'status-pink',
  'REJECTED': 'status-red',
  'INTERVIEW SCHEDULED': 'status-light-green',
};

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

export default function AppliedJobs({ appliedJobs = [] }) {
  const navigate = useNavigate(); // Initialize navigate function
  const { userId } = useParams(); // Retrieve userId from the URL
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });

  const handleViewDetails = (jobPostID) => {
    console.log(`Navigating to job details for job ID: ${jobPostID} and user ID: ${userId}`);
    navigate(`/job-details/${jobPostID}/${userId}`); // Navigate to Job Details page with jobPostID and userId
  };

  return (
    <div className="applications-container">
      <h1 className="applications-heading">Applied Jobs</h1>
      <div className="applications-list">
        {appliedJobs.length > 0 ? (
          appliedJobs.map((job, index) => (
            <div key={index} className="application-card">
              <div className="application-company">
                <img
                  src={getCompanyLogo(job.company)} // Dynamically get the company logo
                  alt={`${job.company} Logo`}
                  className="company-logo"
                />
                <div>
                  <div className="company-name">{job.company}</div>
                  <div className="company-location">
                    <FaMapMarkerAlt className="location-icon" /> {/* Add location pin icon */}
                    {job.location}
                  </div>
                </div>
              </div>
              <div className="application-details">
                <div className="application-role">{job.title}</div>
                <div className="application-meta">
                  <span className="application-type">
                    {job.jobSetup ? job.jobSetup.charAt(0).toUpperCase() + job.jobSetup.slice(1) : 'N/A'}
                  </span> {/* Dynamically display job setup */}
                  <span className="application-salary">
                    Salary: {job.salary ? `$${job.salary.replace('-', '-$')}` : 'N/A'}
                  </span>
                </div>
              </div>
              <div className="application-status">
                <div
                  className={`status ${
                    statusColors[job.status?.toUpperCase()] || 'status-default'
                  }`}
                >
                  {job.status}
                </div>
                <button
                  className="view-details-button"
                  onClick={() => handleViewDetails(job.id)} // Pass jobPostID to the handler
                >
                  View Details →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-applications">
            <p>No applied jobs found.</p>
          </div>
        )}
      </div>

      {/* Popup for success/error messages */}
      {popup.visible && (
        <Popup
          title={popup.title}
          message={popup.message}
          buttonText={popup.buttonText}
          onButtonClick={popup.onButtonClick}
        />
      )}
    </div>
  );
}