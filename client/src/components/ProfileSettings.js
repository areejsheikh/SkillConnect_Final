import React from 'react';
import BasicInformation from './ProfileSettings/BasicInformation';
import CredentialsAndSkills from './ProfileSettings/CredentialsAndSkills';
import CVSection from './ProfileSettings/CVSection';
import SocialLinks from './ProfileSettings/SocialLinks';
import AccountSettings from './ProfileSettings/AccountSettings';
import './styles/ProfileSettings.css';

export default function ProfileSettings() {
  return (
    <div className="profile-settings-container">
      <BasicInformation />
      <CredentialsAndSkills />
      <CVSection />
      <SocialLinks />
      <AccountSettings />
    </div>
  );
}