import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostJobPopupForm from '../components/PostJobPopupForm';

const PostJobPopup = () => {
  const navigate = useNavigate();
  const { recruiterId } = useParams(); // Get recruiterId from URL

  const handleClose = () => {
    navigate(`/manage-job-postings/${recruiterId}`); // Navigate back to the manage jobs page
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Post a Job</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="popup-content-scrollable">
          <PostJobPopupForm onCancel={handleClose} /> {/* Pass handleClose as a prop */}
        </div>
      </div>
    </div>
  );
};

export default PostJobPopup;