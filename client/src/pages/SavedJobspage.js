import React, { useEffect, useState } from 'react';
import NavbarWithIcons from '../components/NavbarWithIcons';
import Footer from '../components/Footer';
import BreadcrumbNavbar from '../components/BreadcrumNavbar';
import SavedJobs from '../components/SavedJobs'; // Import the SavedJobs component
import Sidebar from '../components/Sidebar';
import profileDashServices from '../services/profileDashServices'; // Import the service to fetch saved jobs
import { useParams } from 'react-router-dom'; // Import useParams to get userId

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

const SavedJobsPage = () => {
  const { userId } = useParams(); // Retrieve userId from the URL
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const response = await profileDashServices.getSeekerAllSavedJobs(userId);
        console.log('Saved Jobs:', response.data); // Debugging log
        const formattedJobs = response.data.map((job) => ({
          jobPostID: job.jobPostID,
          title: job.title || 'N/A',
          company: job.company || 'N/A',
          jobLocation: job.jobLocation || 'N/A',
          salaryRange: job.salaryRange || 'N/A',
          jobSetup: job.jobSetup || 'N/A',
          status: job.status || 'N/A',
        }));
        setSavedJobs(formattedJobs);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    fetchSavedJobs();
  }, [userId]);

  const breadcrumbs = [
    { label: 'Home', link: `/dashboard/${userId}` },
    { label: 'Saved Jobs', link: `/saved-jobs/${userId}` },
  ];

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <NavbarWithIcons />
      <BreadcrumbNavbar currentPage="Saved Jobs" breadcrumbs={breadcrumbs} />

      <div style={styles.dashboardContainer}>
        <div style={styles.sidebar}>
          <Sidebar />
        </div>
        <div style={styles.dashboardContent}>
          <h2>My Saved Jobs</h2>
          <SavedJobs savedJobs={savedJobs} /> {/* Pass savedJobs as a prop */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SavedJobsPage;