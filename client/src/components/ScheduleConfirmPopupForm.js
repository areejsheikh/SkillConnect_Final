import React from 'react';
import './styles/LoginPopup.css'; // Reusing the same styling

const ScheduleConfirmPopupForm = () => {
  const handleContinue = () => {
    // You can redirect or refresh or just close the popup
    window.location.href = '/interview-schedule'; // or your desired route
  };

  return (
    <div className="popup-box">
      <div className="popup-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
        <h1>SkillConnect</h1>
      </div>

      <p className="popup-message">
        The interview has been <br />
        successfully scheduled with the applicant.
      </p>

      <button className="popup-continue-button" onClick={handleContinue}>
        Ok
      </button>
    </div>
  );
};

export default ScheduleConfirmPopupForm;
