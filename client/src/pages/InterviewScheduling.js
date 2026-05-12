import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import InterviewSchedulingForm from '../components/InterviewSchedulingForm';

const InterviewScheduling = () => {
  const location = useLocation();
  const params = useParams();
  const applicant = location.state?.applicant; // Get applicant data from navigation state
  const jobPostID = params.jobPostID || location.state?.jobPostID;
  
  console.log('Interview scheduling for applicant:', applicant);
  console.log('URL params:', params);
  console.log('Job Post ID from params or state:', jobPostID);

  if (!applicant) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <h2>No applicant data found</h2>
        <p>Please return to the applicant tracking page and try again.</p>
      </div>
    );
  }

  return (
    <div className="is-wrapper">
      <InterviewSchedulingForm applicant={applicant} jobPostID={jobPostID} />
    </div>
  );
};

export default InterviewScheduling;