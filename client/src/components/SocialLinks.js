import React from 'react';
import './styles/SocialLinks.css'; // Assuming you have a CSS file for styling

export default function SocialLinks() {
  return (
    <div className="section">
      <h2>Social Links</h2>
      <div className="social-link">
        <label>Facebook</label>
        <input type="text" placeholder="Profile link..." />
      </div>
      <div className="social-link">
        <label>Twitter</label>
        <input type="text" placeholder="Profile link..." />
      </div>
      <div className="social-link">
        <label>Instagram</label>
        <input type="text" placeholder="Profile link..." />
      </div>
      <button className="addd-button">Add Another Social Link</button>
    </div>
  );
}