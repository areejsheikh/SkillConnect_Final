import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams for dynamic userId
import './styles/NavbarWithIcons.css'; // Updated CSS file with unique class names

const NavbarWithIcons = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { userId } = useParams(); // Retrieve userId from the current route

  const handleJobPostingsClick = () => {
    navigate(`/job-postings/${userId}`); // Redirect to the Job Postings page with userId
  };

  const handleHomeClick = () => {
    navigate(`/dashboard/${userId}`); // Redirect to the Dashboard with userId
  };

  const handleProfileClick = () => {
    navigate(`/profile-settings/${userId}`); // Redirect to the Profile Dashboard page with userId
  };

  const handleDashboardClick = () => {
    navigate(`/profile-dashboard/${userId}`); // Redirect to the Dashboard with userId
  };

  return (
    <nav className="custom-navbar-icons">
      <div className="custom-logo-icons">
        <img
          src={`${process.env.PUBLIC_URL}/logoskill.png`}
          alt="SkillConnect Logo"
          className="custom-logo-image-icons"
        />
        SkillConnect
      </div>
      <ul className="custom-nav-links-icons">
        <li onClick={handleHomeClick} style={{ cursor: 'pointer' }}>Home</li>
        <li onClick={handleJobPostingsClick} style={{ cursor: 'pointer' }}>Job Postings</li>
        <li onClick={handleDashboardClick} style={{ cursor: 'pointer' }}>Dashboard</li>
      </ul>
      <div className="custom-auth-icons">
        <FaUserCircle className="custom-icon profile-icon" onClick={handleProfileClick} style={{ cursor: 'pointer' }} />
      </div>
    </nav>
  );
};

export default NavbarWithIcons;