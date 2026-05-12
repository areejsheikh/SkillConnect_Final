import React from 'react';
// import { useParams } from 'react-router-dom'; // Import useParams to retrieve userId
import NavbarWithIcons from '../components/NavbarWithIcons';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
// import jobServices from '../services/jobServices'; // Import jobServices

const DashboardPage = () => {
  // const { userId } = useParams(); // Retrieve userId from the URL

  // Function to test getJobDetails
  // const handleGetJobDetails = async () => {
  //   const jobID = 1; // Hardcoded job ID
  //   try {
  //     const jobDetails = await jobServices.getJobDetails(jobID);
  //     console.log('Job Details:', jobDetails);
  //   } catch (error) {
  //     console.error('Error fetching job details:', error);
  //   }
  // };

  // Function to test applyToJob
  // const handleApplyToJob = async () => {
  //   const applicantData = {
  //     applicantID: userId, // Use userId from URL
  //     recruiterID: 2,
  //     jobPostID: 1,
  //   };
  //   try {
  //     const response = await jobServices.applyToJob(applicantData.jobPostID, applicantData);
  //     console.log('Apply to Job Response:', response);
  //   } catch (error) {
  //     console.error('Error applying to job:', error);
  //   }
  // };

  // // Function to test saveJob
  // const handleSaveJob = async () => {
  //   const jobID = 1; // Hardcoded job ID
  //   try {
  //     const response = await jobServices.saveJob(jobID, userId); // Use userId from URL
  //     console.log('Save Job Response:', response);
  //   } catch (error) {
  //     console.error('Error saving job:', error);
  //   }
  // };

  // Function to fetch all jobs
  // const handleGetAllJobs = async () => {
  //   try {
  //     const allJobs = await jobServices.getAllJobs(); // Fetch all jobs
  //     console.log('All Jobs:', allJobs);
  //   } catch (error) {
  //     console.error('Error fetching all jobs:', error);
  //   }
  // };

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <NavbarWithIcons />
      <HeroSection />

      {/* Buttons to test backend linkage */}
      {/* <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Welcome, User {userId}</h2>
        <button onClick={handleGetJobDetails} style={{ margin: '10px', padding: '10px 20px' }}>
          Get Job Details
        </button>
        <button onClick={handleApplyToJob} style={{ margin: '10px', padding: '10px 20px' }}>
          Apply to Job
        </button>
        <button onClick={handleSaveJob} style={{ margin: '10px', padding: '10px 20px' }}>
          Save Job
        </button>
        <button onClick={handleGetAllJobs} style={{ margin: '10px', padding: '10px 20px' }}>
          Get All Jobs
        </button>
      </div> */}

      <HowItWorks />
      <Footer />
    </div>
  );
};

export default DashboardPage;