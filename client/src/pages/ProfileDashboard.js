import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardTopCards from '../components/DashboardTopCards';
import RecentlyAppliedJobs from '../components/RecentlyAppliedJobs';
import NavbarWithIcons from '../components/NavbarWithIcons';
import Footer from '../components/Footer';
import BreadcrumbNavbar from '../components/BreadcrumNavbar';
import profileDashServices from '../services/profileDashServices';

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  sidebar: {
    width: '0px',
    flexShrink: 0,
  },
  dashboardContent: {
    flex: 1,
    padding: '2rem',
    background: 'white',
    marginLeft: '250px',
  },
};

const ProfileDashboard = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState('');
  const [recentlyAppliedJobs, setRecentlyAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [completeProfile, setCompleteProfile] = useState(null); // State for complete profile data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await profileDashServices.getSeekerDashData(userId);
        console.log('User Profile:', userProfile);

        if (userProfile && userProfile.data && userProfile.data.name) {
          setUserName(userProfile.data.name);
        } else {
          console.warn('Name field is missing in userProfile');
          setUserName('User');
        }

        const appliedJobsResponse = await profileDashServices.getSeekerAllAppliedJobs(userId);
        const appliedJobs = appliedJobsResponse.data.map((job) => ({
          id: job.jobPosting.jobPostID,
          title: job.jobPosting.title,
          company: job.jobPosting.company,
          location: job.jobPosting.jobLocation,
          salary: job.jobPosting.salaryRange,
          status: job.applicationStatus,
        }));
        setRecentlyAppliedJobs(appliedJobs);

        const savedJobsResponse = await profileDashServices.getSeekerAllSavedJobs(userId);
        setSavedJobs(savedJobsResponse.data || []);

        // Fetch complete profile data
        const completeProfileResponse = await profileDashServices.getSeekerCompleteProfile(userId);
        console.log('Complete Profile Response:', completeProfileResponse);
        setCompleteProfile(completeProfileResponse.data);
        console.log('Complete Profile:', completeProfileResponse.data); // Debugging log
      } catch (error) {
        console.error('Error fetching profile dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const breadcrumbs = [
    { label: 'Home', link: `/dashboard/${userId}` },
    { label: 'Profile Dashboard', link: `/profile-dashboard/${userId}` },
  ];

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <NavbarWithIcons />
      <BreadcrumbNavbar currentPage="Profile Dashboard" breadcrumbs={breadcrumbs} />

      <div style={styles.dashboardContainer}>
        <div style={styles.sidebar}>
          <Sidebar />
        </div>
        <div style={styles.dashboardContent}>
          <h2>Hello, {userName}</h2>
          <p>Here is your daily activities and job alerts</p>
          <DashboardTopCards
            savedJobs={savedJobs.length}
            appliedJobs={recentlyAppliedJobs.length}
          />
          <RecentlyAppliedJobs jobs={recentlyAppliedJobs} />
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileDashboard;