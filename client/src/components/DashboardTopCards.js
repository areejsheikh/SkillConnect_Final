import React from 'react';
import { FaBriefcase, FaRegBookmark, FaBell } from 'react-icons/fa';
import './styles/DashboardTopCards.css';

const DashboardTopCards = ({ appliedJobs = 0, savedJobs = 0 }) => {
  return (
    <div className="top-cards">
      <div className="card blue">
        <div className="card-content">
          <h3>{appliedJobs}</h3>
          <p>Applied Jobs</p>
        </div>
        <div className="card-icon">
          <FaBriefcase />
        </div>
      </div>

      <div className="card orange">
        <div className="card-content">
          <h3>{savedJobs}</h3>
          <p>Saved Jobs</p>
        </div>
        <div className="card-icon">
          <FaRegBookmark />
        </div>
      </div>

      <div className="card green">
        <div className="card-content">
          <h3>{appliedJobs}</h3>
          <p>Recently Applied</p>
        </div>
        <div className="card-icon">
          <FaBell />
        </div>
      </div>
    </div>
  );
};

export default DashboardTopCards;