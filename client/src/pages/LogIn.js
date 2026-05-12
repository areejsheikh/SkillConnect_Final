import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import LogInForm from '../components/LogInForm';

const LogIn = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="login-container">
      {/* Back button */}
      <div className="back-button" onClick={handleBackClick} style={{ cursor: 'pointer' }}>
        <img src="/backarrow.png" alt="Back" />
      </div>

      {/* Render the login form */}
      <LogInForm />
    </div>
  );
};

export default LogIn;