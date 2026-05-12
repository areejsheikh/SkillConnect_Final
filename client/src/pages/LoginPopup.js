import React from 'react';
import LoginPopupForm from '../components/LoginPopupForm';

const LoginPopup = () => {
  return (
    <div className="popup-overlay">
      <LoginPopupForm />
    </div>
  );
};

export default LoginPopup;
