import React, { useEffect, useState } from 'react';
import NavbarWithIcons from '../components/NavbarWithIcons';
import Footer from '../components/Footer';
import BreadcrumbNavbar from '../components/BreadcrumNavbar';
import AppliedJobs from '../components/AppliedJobs';
import Sidebar from '../components/Sidebar';
import profileDashServices from '../services/profileDashServices'; // Import the service to fetch applied jobs
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams to get userId
import Popup from '../components/Popup'; // Import the Popup component

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'row', // Ensure Sidebar and Content are side by side
    width: '100%',
  },
  sidebar: {
    width: '0px', // Fixed width for Sidebar
    flexShrink: 0,
  },
  dashboardContent: {
    flex: 1,
    padding: '2rem',
    background: 'white',
    marginLeft: '250px', // Ensure content starts after the Sidebar
  },
};

const AppliedJobsPage = () => {
  const { userId } = useParams(); // Retrieve userId from the URL
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        console.log('Fetching applied jobs for user ID:', userId);
        setLoading(true);
        
        // Check if userId exists
        if (!userId) {
          console.error('User ID is missing');
          setError('User ID is missing. Cannot fetch applications.');
          setLoading(false);
          
          // Show error popup
          setPopup({
            visible: true,
            title: 'Error',
            message: 'User ID is missing. Cannot fetch applications.',
            buttonText: 'Go Back',
            onButtonClick: () => {
              setPopup({ visible: false });
              navigate('/'); // Redirect to home page
            }
          });
          return;
        }
        
        const response = await profileDashServices.getSeekerAllAppliedJobs(userId);
        console.log('Applied Jobs Response:', response);
        
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Invalid response format:', response);
          setError('Received invalid data format from server');
          setLoading(false);
          
          // Show error popup
          setPopup({
            visible: true,
            title: 'Data Error',
            message: 'We encountered an issue while loading your applied jobs.',
            buttonText: 'Try Again',
            onButtonClick: () => {
              setPopup({ visible: false });
              window.location.reload(); // Reload the page
            }
          });
          return;
        }
        
        const formattedJobs = response.data.map((job) => ({
          id: job.jobPosting?.jobPostID,
          title: job.jobPosting?.title || 'No Title',
          company: job.jobPosting?.company || 'Unknown Company',
          location: job.jobPosting?.jobLocation || 'Location not specified',
          salary: job.jobPosting?.salaryRange || 'Salary not specified',
          status: job.applicationStatus || 'Under Review',
          jobSetup: job.jobPosting?.jobSetup || 'Not specified', 
        }));
        
        console.log('Formatted Jobs:', formattedJobs);
        setAppliedJobs(formattedJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        setError(error.message || 'Failed to fetch applied jobs');
        setLoading(false);
        
        // Show error popup
        setPopup({
          visible: true,
          title: 'Error',
          message: `Failed to load your applied jobs: ${error.message || 'Unknown error'}`,
          buttonText: 'Try Again',
          onButtonClick: () => {
            setPopup({ visible: false });
            window.location.reload(); // Reload the page
          }
        });
      }
    };

    fetchAppliedJobs();
  }, [userId, navigate]);

  const breadcrumbs = [
    { label: 'Home', link: `/dashboard/${userId}` },
    { label: 'Applied Jobs', link: `/applied-jobs-page/${userId}` },
  ];

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <NavbarWithIcons />
      <BreadcrumbNavbar currentPage="Applied Jobs" breadcrumbs={breadcrumbs} />

      <div style={styles.dashboardContainer}>
        <div style={styles.sidebar}>
          <Sidebar />
        </div>
        <div style={styles.dashboardContent}>
          <h2>My Applications</h2>
          
          {loading ? (
            <div className="loading-indicator">Loading your applications...</div>
          ) : error ? (
            <div className="error-message">
              {error}
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <AppliedJobs appliedJobs={appliedJobs} />
          )}
        </div>
      </div>
      
      {/* Popup component for error/success messages */}
      {popup.visible && (
        <Popup
          title={popup.title}
          message={popup.message}
          buttonText={popup.buttonText}
          onButtonClick={popup.onButtonClick}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default AppliedJobsPage;