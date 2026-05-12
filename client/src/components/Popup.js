import React from 'react';
import './styles/LoginPopup.css'; // Reuse the existing CSS file for styling

const Popup = ({ title, message, buttonText, onButtonClick, logoSrc = '/logoskill.png' }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-logo">
          <img src={logoSrc} alt="Logo" />
          <h1>{title}</h1>
        </div>

        <p className="popup-message">{message}</p>

        <button className="popup-continue-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Popup;