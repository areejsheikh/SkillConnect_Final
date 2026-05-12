import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarWithIcons from '../components/NavbarWithIcons';
import Footer from '../components/Footer';
import BreadcrumbNavbar from '../components/BreadcrumNavbar';
import Sidebar from '../components/Sidebar';
import BasicInformation from '../components/BasicInformation';
import CredentialsAndSkills from '../components/CredentialsAndSkills';
import CVSection from '../components/CVSection';
import AccountSettings from '../components/AccountSettings';
import profileDashServices from '../services/profileDashServices';

const ProfileSettingsPage = () => {
  const { userId } = useParams(); // Retrieve userId from the URL
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await profileDashServices.getSeekerCompleteProfile(userId); // Fetch complete profile
        const profileData = response.data; // Extract the 'data' object from the response
        setUserData(profileData); // Set the extracted data to state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSaveChanges = async (updatedData) => {
    try {
      await profileDashServices.updateUserData(userId, updatedData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update profile.');
    }
  };

  const breadcrumbs = [
    { label: 'Home', link: `/dashboard/${userId}` },
    { label: 'Profile Settings', link: `/profile-settings/${userId}` },
  ];

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      <NavbarWithIcons />
      <BreadcrumbNavbar currentPage="Profile Settings" breadcrumbs={breadcrumbs} />

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ width: '250px', flexShrink: 0 }}>
          <Sidebar />
        </div>
        <div style={{ flex: 1, padding: '2rem', background: 'white' }}>
          <h2>Profile Settings</h2>
          {userData ? (
            <>
              <BasicInformation
                userData={{
                  profilePicture: userData.basicProfile?.profilePicTitle || 'defaultPerson.png',
                  firstName: userData.basicProfile?.firstName || '',
                  lastName: userData.basicProfile?.lastName || '',
                  email: userData.basicProfile?.email || '',
                  role: userData.workingStatus?.primaryRole || '',
                  company: userData.workingStatus?.company || '',
                  experience: userData.workingStatus?.experience || '',
                  workSetup: userData.workingStatus?.workSetup || 'Remote',
                }}
                onSaveChanges={handleSaveChanges}
              />
              <CredentialsAndSkills
                userData={{
                  credentials: userData.seekerCredentials?.map((cred) => cred.credential) || [],
                }}
                onSaveChanges={handleSaveChanges}
              />
              <CVSection />
              <AccountSettings userData={userData} onSaveChanges={handleSaveChanges} />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileSettingsPage;