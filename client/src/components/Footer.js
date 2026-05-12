import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/Footer.css';
import Popup from './Popup'; // Reuse the generic Popup component

const Footer = () => {
  const navigate = useNavigate();
  const { userId } = useParams(); // Retrieve userId from the URL
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });

  const handleAboutUsClick = () => {
    setPopup({
      visible: true,
      title: 'About SkillConnect',
      message: 'SkillConnect is a platform designed to connect job seekers with top employers. Our mission is to make job searching and hiring seamless and efficient.',
      buttonText: 'Close',
      onButtonClick: () => setPopup({ visible: false }),
    });
  };

  const handleContactClick = () => {
    setPopup({
      visible: true,
      title: 'Contact Us',
      message: 'For inquiries, please email us at support@skillconnect.com or call us at +1-800-555-1234.',
      buttonText: 'Close',
      onButtonClick: () => setPopup({ visible: false }),
    });
  };

  const handlePostingsOrTrendingClick = () => {
    if (userId) {
      navigate(`/job-postings/${userId}`); // Navigate to job postings page with userId
    } else {
      navigate('/login'); // Navigate to login page if not logged in
    }
  };

  const handleSavedOrApplicationsClick = () => {
    if (userId) {
      navigate(`/profile-dashboard/${userId}`); // Navigate to profile dashboard with userId
    } else {
      navigate('/login'); // Navigate to login page if not logged in
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">SkillConnect</div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Company</h4>
            <p onClick={handleAboutUsClick} style={{ cursor: 'pointer' }}>About Us</p>
            <p onClick={handleContactClick} style={{ cursor: 'pointer' }}>Contact</p>
          </div>
          <div className="footer-column">
            <h4>Jobs</h4>
            <p onClick={handlePostingsOrTrendingClick} style={{ cursor: 'pointer' }}>Postings</p>
            <p onClick={handlePostingsOrTrendingClick} style={{ cursor: 'pointer' }}>Trending</p>
          </div>
          <div className="footer-column">
            <h4>My Search</h4>
            <p onClick={handleSavedOrApplicationsClick} style={{ cursor: 'pointer' }}>Saved</p>
            <p onClick={handleSavedOrApplicationsClick} style={{ cursor: 'pointer' }}>Applications</p>
          </div>
        </div>
      </div>

      {/* Render Popup */}
      {popup.visible && (
        <Popup
          title={popup.title}
          message={popup.message}
          buttonText={popup.buttonText}
          onButtonClick={popup.onButtonClick}
        />
      )}
    </footer>
  );
};

export default Footer;