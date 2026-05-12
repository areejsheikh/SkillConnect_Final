import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import SignUpForm from '../components/SignUpForm';

const SignUp = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="signup-container">
      {/* Back button */}
      <div className="back-button" onClick={handleBackClick} style={{ cursor: 'pointer' }}>
        <img src="/backarrow.png" alt="Back" />
      </div>

      {/* Logo */}
      <div className="logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
      </div>

      {/* Sign-up form */}
      <SignUpForm />
    </div>
  );
};

export default SignUp;