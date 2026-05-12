import React, { useState } from 'react';
import './styles/AccountSettings.css';
import userServices from '../services/userServices';
import Popup from './Popup'; // Import the Popup component if available

export default function AccountSettings({ userData, onSaveChanges }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });
  const [passwordError, setPasswordError] = useState('');

  const validatePasswords = () => {
    // Clear any previous errors
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Current password is required');
      return false;
    }
    
    if (!newPassword) {
      setPasswordError('New password is required');
      return false;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validatePasswords()) {
      return;
    }

    try {
      setLoading(true);
      // Send both the current and new password for verification
      const response = await userServices.updateUserPassword(
        userData.id, 
        {
          currentPassword: currentPassword,
          newPassword: newPassword
        }
      );
      
      // Show success popup
      setPopup({
        visible: true,
        title: 'Success',
        message: 'Password updated successfully!',
        buttonText: 'Close',
        onButtonClick: () => {
          setPopup({ visible: false });
          // Clear password fields
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      });
    } catch (error) {
      console.error('Error updating password:', error);
      
      // Extract error message from response
      let errorMessage = 'Failed to update password. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error popup
      setPopup({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false })
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Account Settings</h2>

      <h3>Change Password</h3>
      {passwordError && <div className="error-message">{passwordError}</div>}
      <div className="input-group">
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />
      </div>
      <div className="input-group">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <div className="input-group">
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>
      <button onClick={handleSave} className="save-button" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </button>

      <h3>Delete Your Account</h3>
      <p className="warning-text">Warning: This action cannot be undone. All your data will be permanently deleted.</p>
      <button className="delete-button">Delete Account</button>
      
      {/* Popup for success/error messages */}
      {popup.visible && (
        <Popup
          title={popup.title}
          message={popup.message}
          buttonText={popup.buttonText}
          onButtonClick={popup.onButtonClick}
        />
      )}
    </div>
  );
}
