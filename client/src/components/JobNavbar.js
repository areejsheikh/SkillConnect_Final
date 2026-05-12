import React, { useState } from 'react';
import { FaPlus, FaFolder, FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './styles/JobNavbar.css';
import './styles/LoginPopup.css'; // Import the popup styling

const JobNavbar = ({ active = '' }) => {
  const navigate = useNavigate();
  const { recruiterId } = useParams(); // Get recruiterId from the URL
  const [showPopup, setShowPopup] = useState(false); // State to toggle the popup

  const handleUserIconClick = () => {
    navigate(`/provider-profile-manage/${recruiterId}`);
  };

  const handleLogoutClick = () => {
    setShowPopup(true); // Show the popup
  };

  const handleCancel = () => {
    setShowPopup(false); // Close the popup
  };

  const handleConfirmLogout = () => {
    // You could add additional logout logic here if needed
    console.log('User logged out');
    setShowPopup(false); // Close the popup
    navigate('/'); // Redirect to the homepage
  };

  return (
    <>
      {/* Logout Confirmation Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="popup-logo">
              <img src="/logoskill.png" alt="Logo" />
              <h1>Confirm Sign Out</h1>
            </div>
            <p className="popup-message">Are you sure you want to sign out?</p>
            <div className="popup-buttons">
              <button className="popup-cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="popup-confirm-button" onClick={handleConfirmLogout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="job-navbar">
        <div className="job-logo-container">
          <img src="/logoskill.png" alt="SkillConnect Logo" className="job-logo-img" />
          <div className="job-logo-text">SkillConnect</div>
        </div>

        <ul className="job-nav-links">
          <li className={active === 'post' ? 'active' : ''}>
            <Link to={`/post-job-popup/${recruiterId}`} className="job-nav-item">
              <FaPlus className="job-icon" />
              <span>Post New Job</span>
            </Link>
          </li>
          <li className={active === 'manage' ? 'active' : ''}>
            <Link to={`/manage-job-postings/${recruiterId}`} className="job-nav-item">
              <FaFolder className="job-icon" />
              <span>Manage Job Postings</span>
            </Link>
          </li>
          <li className={active === 'search' ? 'active' : ''}>
            <Link to={`/applicant-search/${recruiterId}`} className="job-nav-item">
              <FaSearch className="job-icon" />
              <span>Applicants Search</span>
            </Link>
          </li>
          <li className={active === 'analytics' ? 'active' : ''}>
            <Link to={`/job-analytics/${recruiterId}`} className="job-nav-item">
              <FaCalendarAlt className="job-icon" />
              <span>Job Analytics</span>
            </Link>
          </li>
        </ul>

        <div className="job-user">
          <div className="job-nav-item" onClick={handleUserIconClick} style={{ cursor: 'pointer' }}>
            <FaUser className="job-icon" />
            <span>User</span>
          </div>
          <button className="job-logout-btn" onClick={handleLogoutClick}>Log Out</button>
        </div>
      </nav>
    </>
  );
};

export default JobNavbar;