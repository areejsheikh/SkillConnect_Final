import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ManageJobPostingsForm from '../components/ManageJobPostingsForm';
import JobNavbar from '../components/JobNavbar';
import manageJobServices from '../services/managejobServices.js';

const ManageJobPostings = () => {
  const { recruiterId } = useParams(); // Get recruiterId from the URL
  const [selectedJobPostID, setSelectedJobPostID] = useState(null); // State to track selected jobPostID

  const handleGetApplicants = async (jobPostID) => {
    try {
      console.log(`Fetching applicants for jobPostID: ${jobPostID}`);
      const response = await manageJobServices.getAllApplicantsDetailsForJob(jobPostID);
      console.log('Applicants details received:', response);
    } catch (error) {
      console.error('Error fetching applicants details:', error);
    }
  };

  return (
    <div className="manage-job-postings-wrapper">
      <JobNavbar active="manage" />
      <ManageJobPostingsForm
        recruiterId={recruiterId}
        onGetApplicants={handleGetApplicants} // Pass the handler to the form
        setSelectedJobPostID={setSelectedJobPostID} // Optional: Track selected jobPostID
      />
    </div>
  );
};

export default ManageJobPostings;