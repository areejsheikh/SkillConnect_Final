import React from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import './styles/HeroSection.css'; // Ensure the correct path for styles

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const { userId } = useParams(); // Retrieve userId from the URL

  const handleStartSearching = () => {
    if (userId) {
      navigate(`/job-postings/${userId}`); // Navigate to the job postings page if user is logged in
    } else {
      navigate('/login'); // Navigate to the login page if user is not logged in
    }
  };

  return (
    <section className="hero">
      <div className="hero-overlay">
        <h1>Find Your Dream Job</h1>
        <button onClick={handleStartSearching}>Start Searching</button> {/* Add onClick handler */}
      </div>
    </section>
  );
};

export default HeroSection;