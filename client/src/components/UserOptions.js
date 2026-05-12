import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './styles/UserOptions.css'; // Import the CSS file

const UserOptions = () => {
  const navigate = useNavigate(); // Initialize navigate function

  const handleNavigateToLogin = () => {
    navigate('/login'); // Redirect to the Login page
  };

  return (
    <section className="user-options">
      <div className="user-card candidate">
        <div className="content">
          <h3>Join as a Candidate</h3>
          <p>Take the first step toward your dream job. Create your profile and connect with top employers today.</p>
          <button onClick={handleNavigateToLogin}>
            Get Started <span className="arrow">→</span>
          </button>
        </div>
      </div>
      <div className="user-card employer">
        <div className="content">
          <h3>Hire Top Talent</h3>
          <p>Find the perfect candidates for your organization. Post jobs and manage applications effortlessly.</p>
          <button onClick={handleNavigateToLogin}>
            Post a Job <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserOptions;