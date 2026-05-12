import React from 'react';
import RejectionConfirmPopupForm from '../components/RejectionConfirmPopupForm';

const RejectionConfirmPopup = () => {
  return (
    <div className="popup-overlay">
      <RejectionConfirmPopupForm />
    </div>
  );
};

export default RejectionConfirmPopup;
