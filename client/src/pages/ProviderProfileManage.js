import React, { useState } from 'react';
import '../components/styles/ProviderProfileManage.css';
import ProviderProfileManageForm from '../components/ProviderProfileManageForm';
import JobNavbar from '../components/JobNavbar'; // Import the JobNavbar component
import Popup from '../components/Popup';

const ProviderProfileManage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleHelpClick = () => {
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the popup
  };

  return (
    <div className="provider-profile-manage">
      <JobNavbar /> {/* Navbar at the top */}
      <div className="content-wrapper">
        <div className="sidebar">
          <ul className="sidebar-menu">
            <li>
              <i className="fas fa-user"></i> Edit personal profile
            </li>
            <li onClick={handleHelpClick} style={{ cursor: 'pointer' }}>
              <i className="fas fa-question-circle"></i> Help
            </li>
          </ul>
        </div>

        <div className="main-content">
          <div className="profile-header">
            <button className="back-button">&larr;</button>
            <h2>Edit personal profile</h2>
            <div className="user-icon">
              <i className="fas fa-user-circle fa-2x"></i>
            </div>
          </div>

          <ProviderProfileManageForm />
        </div>
      </div>

      {/* Render the Popup only when isPopupOpen is true */}
      {isPopupOpen && (
        <Popup
          title="Help"
          message="Contact us at support@example.com. For more information, visit our FAQ page."
          buttonText="Close"
          onButtonClick={closePopup} // Use onButtonClick to close the popup
        />
      )}
    </div>
  );
};

export default ProviderProfileManage;