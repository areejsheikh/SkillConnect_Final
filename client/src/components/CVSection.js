import React, { useState } from 'react';
import { AiFillFileText } from 'react-icons/ai'; // Importing an icon from react-icons
import './styles/CVSection.css';

export default function CVSection() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleEdit = () => {
    console.log('Edit CV');
    setShowMenu(false);
  };

  const handleDelete = () => {
    console.log('Delete CV');
    setShowMenu(false);
  };

  return (
    <div className="section cv-section">
      <h2>Your CV/Resume</h2>
      <div className="cv-item">
        <div className="cv-header">
          <span className="document-icon">
            <AiFillFileText />
          </span>
          <h3>Professional Resume</h3>
          <div className="menu-container">
            <button className="menu-button" onClick={handleMenuToggle}>
              ⋮
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}