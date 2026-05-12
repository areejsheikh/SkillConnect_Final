import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ApplicantTrackingForm from '../components/ApplicantTrackingForm';
import JobNavbar from '../components/JobNavbar';

const ApplicantTracking = () => {
  const { jobPostID, recruiterId } = useParams();
  const location = useLocation();
  
  // Debug log
  console.log('ApplicantTracking page params:', { jobPostID, recruiterId });
  console.log('ApplicantTracking location state:', location.state);

  return (
    <div className="applicant-tracking-container">
      <JobNavbar active="manage" />
      {/* Render the applicant tracking form with props */}
      <ApplicantTrackingForm />
    </div>
  );
};

export default ApplicantTracking;