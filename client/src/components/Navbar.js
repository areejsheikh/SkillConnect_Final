import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './styles/Navbar.css'; // Import the updated CSS file

const Navbar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleSignupClick = () => {
    navigate('/signup'); // Redirect to the Sign Up page
  };

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the Login page
  };

  const handleJobPostingsClick = () => {
    navigate('/job-postings'); // Redirect to the Job Postings page
  };

  const handleDashboardClick = () => {
    navigate('/profile-dashboard'); // Redirect to the Dashboard page
  };

  return (
    <nav className="custom-navbar">
      <div className="custom-logo">
        <img src={`${process.env.PUBLIC_URL}/logoskill.png`} alt="SkillConnect Logo" className="custom-logo-image" />
        SkillConnect
      </div>
      <ul className="custom-nav-links">
        <li>Home</li>
        <li onClick={handleJobPostingsClick} style={{ cursor: 'pointer' }}>Job Postings</li>
        <li onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>Dashboard</li>
      </ul>
      <div className="custom-auth-buttons">
        <button className="custom-signup-button" onClick={handleSignupClick}>Sign Up</button>
        <span>|</span>
        <button className="custom-login-button" onClick={handleLoginClick}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;