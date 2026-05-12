import React from 'react';
import './styles/LoginPopup.css'; // Reusing the existing styling

const RejectionConfirmPopupForm = () => {
  const handleConfirmReject = () => {
    // Handle the rejection logic here
    alert('Applicant Rejected!');
  };

  return (
    <div className="popup-box">
      <div className="popup-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
        <h1>SkillConnect</h1>
      </div>

      <p className="popup-message">
        Are you sure you want to <br />
        reject this applicant for this job posting?
      </p>

      <button className="popup-continue-button" onClick={handleConfirmReject}>
        Confirm
      </button>
    </div>
  );
};

export default RejectionConfirmPopupForm;
