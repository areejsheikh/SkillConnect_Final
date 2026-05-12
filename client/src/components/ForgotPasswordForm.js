import React from 'react';
import './styles/LoginPopup.css'; // Still reusing the same styling

const ForgotPasswordForm = () => {
  const handleOk = () => {
    window.location.href = '/login'; // Redirect after pressing OK
  };

  return (
    <div className="popup-box">
      <div className="popup-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
        <h1>SkillConnect</h1>
      </div>

      <p className="popup-message">
        An Email has been <br />
        sent to your email <br />
        account to help you <br />
        recover your <br />
        <strong>password!</strong>
      </p>

      <button className="popup-continue-button" onClick={handleOk}>
        Ok
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
