import React from 'react';
import ApplicantSearchForm from '../components/ApplicantSearchForm';
import JobNavbar from '../components/JobNavbar';

const ApplicantSearch = () => {
  return (
    <div className="as-page">
      <JobNavbar />
      {/* Render the applicant search form */}
      <ApplicantSearchForm />
    </div>
  );
};

export default ApplicantSearch; 
