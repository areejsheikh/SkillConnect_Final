import React from 'react';
import styles from './styles/LoginPopup.css'; // Keep same CSS file

const SignUpPopupForm = () => {
  const handleContinue = () => {
    // You can change this to whatever route or logic you want
    window.location.href = '/dashboard';
  };

  return (
    <div className="popup-box">
      <div className="popup-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
        <h1>SkillConnect</h1>
      </div>

      <p className="popup-message">
        You have been <br />
        <strong>successfully registered in</strong> <br />
        on <strong><i>SkillConnect</i></strong>
      </p>

      <button className="popup-continue-button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default SignUpPopupForm;
