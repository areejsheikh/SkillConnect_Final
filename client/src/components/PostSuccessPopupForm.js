import React from 'react';
import './styles/LoginPopup.css'; // Reusing the existing styling

const PostSuccessPopupForm = () => {
  const handleOk = () => {
    window.location.href = '/job-listings'; // You can change this route
  };

  return (
    <div className="popup-box">
      <div className="popup-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
        <h1>SkillConnect</h1>
      </div>

      <p className="popup-message">
        Job Listing has been <br />
        posted successfully!
      </p>

      <button className="popup-continue-button" onClick={handleOk}>
        Ok
      </button>
    </div>
  );
};

export default PostSuccessPopupForm;
