import React, { useState, useEffect } from 'react';
import './styles/BasicInformation.css';

export default function BasicInformation({ userData, onSaveChanges }) {
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [email, setEmail] = useState(userData.email || '');
  const [role, setRole] = useState(userData.role || '');
  const [company, setCompany] = useState(userData.company || '');
  
  // Handle experience with proper parsing - convert to number and back to string if valid
  const [experience, setExperience] = useState(() => {
    if (userData.experience) {
      const cleanedValue = userData.experience.toString().trim();
      return !isNaN(cleanedValue) ? cleanedValue : '';
    }
    return '';
  });
  
  // Normalize workSetup value to match select options exactly
  const [workSetup, setWorkSetup] = useState(() => {
    // Default to Remote if nothing is provided
    if (!userData.workSetup) return 'Remote';
    
    // Normalize the workSetup to match our select options exactly
    const setup = userData.workSetup.toString().trim().toLowerCase();
    
    // Map different possible variations to our exact option values
    if (setup === 'on-site' || setup === 'on site' || setup === 'onsite') return 'Onsite';
    if (setup === 'hybrid') return 'Hybrid';
    // Default to Remote for any other value
    return 'Remote';
  });

  // For debugging - log what's actually in userData
  useEffect(() => {
    console.log('Raw userData workSetup:', userData.workSetup);
    console.log('Normalized workSetup:', workSetup);
  }, [userData.workSetup, workSetup]);

  const handleSave = () => {
    const updatedData = {
      firstName,
      lastName,
      email,
      role,
      company,
      experience: experience.trim(), // Ensure we save without extra spaces
      workSetup,
    };
    onSaveChanges(updatedData);
  };

  // Handle experience input with validation
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    // Only allow empty string or valid numbers
    if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
      setExperience(value);
    }
  };

  // Get color based on first letter of first name - same approach as in ApplicantTrackingForm
  const getColorForLetter = (letter) => {
    const letterColors = {
      'A': '#FF5733', 'B': '#33FF57', 'C': '#3357FF', 'D': '#F033FF',
      'E': '#FF33A8', 'F': '#33FFF3', 'G': '#FFB533', 'H': '#B533FF',
      'I': '#33FF8A', 'J': '#FF338A', 'K': '#338AFF', 'L': '#FF5733',
      'M': '#33FF57', 'N': '#3357FF', 'O': '#F033FF', 'P': '#FF33A8',
      'Q': '#33FFF3', 'R': '#FFB533', 'S': '#B533FF', 'T': '#33FF8A',
      'U': '#FF338A', 'V': '#338AFF', 'W': '#FF5733', 'X': '#33FF57',
      'Y': '#3357FF', 'Z': '#F033FF'
    };
    
    if (!letter) return '#6c757d'; // Default gray
    
    const upperLetter = letter.toUpperCase();
    return letterColors[upperLetter] || '#6c757d';
  };

  return (
    <div className="section">
      <h1>Basic Information</h1>
      <div className="basic-info-container">
        <div className="profile-picture-display">
          {/* Avatar with first letter - non-clickable */}
          <div 
            className="avatar-letter"
            style={{ 
              backgroundColor: getColorForLetter(firstName ? firstName.charAt(0) : ''),
              color: '#ffffff',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '2.5rem'
            }}
          >
            {firstName ? firstName.charAt(0).toUpperCase() : ''}
          </div>
        </div>
        <div className="name-fields">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>
      </div>
      <div className="input-group">
        <label>Primary Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
      </div>
      <div className="row">
        <div className="input-group">
          <label>Primary Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
          />
        </div>
        <div className="input-group">
          <label>Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
          />
        </div>
      </div>
      <div className="row">
        <div className="input-group">
          <label>Experience</label>
          <input
            type="text" 
            value={experience}
            onChange={handleExperienceChange}
            placeholder="Experience"
          />
        </div>
        <div className="input-group">
          <label>Work Set-up</label>
          <select value={workSetup} onChange={(e) => setWorkSetup(e.target.value)}>
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>
      <button onClick={handleSave} className="save-button">
        Save Changes
      </button>
    </div>
  );
}