import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import './styles/Sidebar.css'; // Import your CSS file
import './styles/LoginPopup.css'; // Reuse the provided popup styling

const Sidebar = () => {
  const { userId } = useParams(); // Retrieve userId from the URL
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [showPopup, setShowPopup] = useState(false); // State to toggle the popup

  // If userId is not available, handle it gracefully
  const safeUserId = userId || '';

  const handleSignOutClick = () => {
    setShowPopup(true); // Show the popup
  };

  const handleCancel = () => {
    setShowPopup(false); // Close the popup
  };

  const handleConfirmSignOut = () => {
    // Clear authentication data from localStorage and sessionStorage
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    
    sessionStorage.removeItem('userToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userId');
    
    console.log('User signed out');
    
    setShowPopup(false); // Close the popup
    navigate('/'); // Redirect to the homepage
  };

  return (
    <>
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
              <button className="popup-confirm-button" onClick={handleConfirmSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="custom-sidebar">
        <div className="logo">SkillConnect</div>
        <nav className="custom-sidebar-nav">
          <ul>
            <li>
              <NavLink 
                to={`/profile-dashboard/${safeUserId}`} 
                className={({ isActive }) => 
                  isActive ? "custom-sidebar-link active" : "custom-sidebar-link"
                }
              >
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink 
                to={`/applied-jobs-page/${safeUserId}`} 
                className={({ isActive }) => 
                  isActive ? "custom-sidebar-link active" : "custom-sidebar-link"
                }
              >
                Applied Jobs
              </NavLink>
            </li>
            <li>
              <NavLink 
                to={`/saved-jobs/${safeUserId}`} 
                className={({ isActive }) => 
                  isActive ? "custom-sidebar-link active" : "custom-sidebar-link"
                }
              >
                Saved Jobs
              </NavLink>
            </li>
            <li>
              <NavLink 
                to={`/profile-settings/${safeUserId}`} 
                className={({ isActive }) => 
                  isActive ? "custom-sidebar-link active" : "custom-sidebar-link"
                }
              >
                Profile Settings
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="custom-sidebar-footer">
          <ul>
            <li>
              <button className="custom-sidebar-link" onClick={handleSignOutClick}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;