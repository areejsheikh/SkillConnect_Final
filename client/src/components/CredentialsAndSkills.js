import React, { useState } from 'react';
import './styles/CredentialsAndSkills.css';

export default function CredentialsAndSkills({ userData, onSaveChanges }) {
  const [credentials, setCredentials] = useState(userData.credentials || []);

  const handleInputChange = (index, value) => {
    const updatedCredentials = [...credentials];
    updatedCredentials[index] = value;
    setCredentials(updatedCredentials);
  };

  const handleDelete = (index) => {
    const updatedCredentials = credentials.filter((_, i) => i !== index);
    setCredentials(updatedCredentials);
  };

  const handleAddCredential = () => {
    setCredentials([...credentials, '']);
  };

  const handleSave = () => {
    onSaveChanges({ credentials });
  };

  return (
    <div className="section">
      <h2>Your Credentials & Skills</h2>
      {credentials.map((credential, index) => (
        <div key={index} className="credential">
          <input
            type="text"
            value={credential}
            onChange={(e) => handleInputChange(index, e.target.value)}
            placeholder="Enter your credential or skill"
            className="credential-input"
          />
          <button
            className="reset-button"
            onClick={() => handleDelete(index)}
            title="Delete"
          >
            ✖
          </button>
        </div>
      ))}
      <button className="add-button" onClick={handleAddCredential}>
        <span className="plus-icon">+</span> Add More Credentials/Skills
      </button>
      <button onClick={handleSave} className="save-button">
        Save Changes
      </button>
    </div>
  );
}