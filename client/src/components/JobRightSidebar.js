import React, { useEffect, useState } from 'react';
import './styles/JobRightSidebar.css';
import {
  FaMapMarkerAlt, FaCalendarAlt, FaClock,
  FaLayerGroup, FaGraduationCap, FaLinkedin,
  FaFacebook, FaTwitter, FaEnvelope, FaRegBookmark
} from 'react-icons/fa';
import { useParams } from 'react-router-dom'; // Import useParams to retrieve jobPostID and userId
import jobService from '../services/jobServices'; // Import jobService
import Popup from './Popup'; // Import the reusable Popup component

const JobRightSidebar = () => {
  const { jobPostID, userId } = useParams(); // Retrieve jobPostID and userId from the URL
  const [sidebarData, setSidebarData] = useState(null);
  const [recruiterID, setRecruiterID] = useState(null); // State to store recruiterID
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' }); // Popup state

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await jobService.getJobDetails(jobPostID); // Fetch job details
        const jobDetails = response.data;

        // Use the userID field from job details as recruiterID
        setRecruiterID(jobDetails.userID);

        setSidebarData({
          salary: jobDetails.salaryRange
            ? {
                min: jobDetails.salaryRange.split('-')[0].trim().replace('$', '').replace(/,/g, ''),
                max: jobDetails.salaryRange.split('-')[1].trim().replace('$', '').replace(/,/g, '')
              }
            : { min: 0, max: 0 },
          location: jobDetails.jobLocation || 'Not specified',
          postedDate: jobDetails.created_at ? new Date(jobDetails.created_at).toLocaleDateString() : 'Not specified',
          expiryDate: jobDetails.expires_at ? new Date(jobDetails.expires_at).toLocaleDateString() : 'Not specified',
          jobLevel: jobDetails.jobLevel || 'Not specified',
          education: jobDetails.eduReq || 'Not specified',
        });
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error);
      }
    };

    fetchSidebarData();
  }, [jobPostID]);

  const handleSaveJob = async () => {
    try {
      const response = await jobService.saveJob(jobPostID, userId);
      console.log('Save Job Response:', response);

      // Show popup with the actual message from the controller
      setPopup({
        visible: true,
        title: response.success ? 'Success' : 'Info',
        message: response.message || 'Job saved successfully!',
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    } catch (error) {
      console.error('Failed to save job:', error);
      
      // Try to extract error message from the response
      let errorMessage = 'Failed to save the job. Please try again.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error popup with the actual error message
      setPopup({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    }
  };

  const handleApplyToJob = async () => {
    const applicantData = {
      applicantID: userId, // Use userId from URL
      recruiterID: recruiterID, // Use recruiterID extracted from job details
      jobPostID: jobPostID, // Include jobPostID
    };

    console.log('Applicant Data Sent:', applicantData); // Log the applicant data

    try {
      const response = await jobService.applyToJob(jobPostID, applicantData);
      console.log('Apply to Job Response:', response);

      // Show popup with the actual message from the controller
      setPopup({
        visible: true,
        title: response.success ? 'Success' : 'Info',
        message: response.message || 'Successfully applied to the job!',
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    } catch (error) {
      console.error('Failed to apply to the job:', error);
      
      // Try to extract error message from the response
      let errorMessage = 'Failed to apply to the job. Please try again.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error popup with the actual error message
      setPopup({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    }
  };

  if (!sidebarData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-sidebar">
      <div className="sidebar-actions">
        <button className="bookmark-btn" onClick={handleSaveJob}>
          <FaRegBookmark className="bookmark-icon" /> Save Job
        </button>
        <button className="apply-btn" onClick={handleApplyToJob}>Apply Now →</button>
      </div>

      <div className="salary-location-card">
        <div className="salary-info">
          <h4>Salary (USD)</h4>
          <p className="salary-amount">
            ${parseInt(sidebarData.salary.min).toLocaleString()} - ${parseInt(sidebarData.salary.max).toLocaleString()}
          </p>
          <span>Yearly salary</span>
        </div>
        <div className="divider"></div>
        <div className="location-info">
          <h4>Job Location</h4>
          <p><FaMapMarkerAlt className="icon" /> {sidebarData.location}</p>
        </div>
      </div>

      <div className="job-overview-card">
        <h4>Job Overview</h4>
        <div className="overview-grid">
          <div className="overview-item">
            <FaCalendarAlt className="icon" />
            <div>
              <p>Job Posted:</p>
              <span>{sidebarData.postedDate}</span>
            </div>
          </div>
          <div className="overview-item">
            <FaClock className="icon" />
            <div>
              <p>Job Expire In:</p>
              <span>{sidebarData.expiryDate}</span>
            </div>
          </div>
          <div className="overview-item">
            <FaLayerGroup className="icon" />
            <div>
              <p>Job Level:</p>
              <span>{sidebarData.jobLevel}</span>
            </div>
          </div>
          <div className="overview-item">
            <FaGraduationCap className="icon" />
            <div>
              <p>Education:</p>
              <span>{sidebarData.education}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="share-card">
        <h4>Share this job:</h4>
        <div className="share-buttons">
          <button><FaLinkedin /></button>
          <button><FaFacebook /></button>
          <button><FaTwitter /></button>
          <button><FaEnvelope /></button>
        </div>
        <button className="copy-link-btn">Copy Links</button>
      </div>

      {/* Popup */}
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
};

export default JobRightSidebar;