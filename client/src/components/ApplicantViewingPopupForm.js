import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ApplicantViewingPopup.css';
import { getApplicantDetails } from '../services/processApplicantsServices.js';

const ApplicantViewingPopupForm = ({ applicant, onClose, onReject, onScheduleInterview }) => {
  const modalRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Center the modal when it first renders
  useEffect(() => {
    if (modalRef.current && position.x === null && position.y === null) {
      const modalWidth = modalRef.current.offsetWidth;
      const modalHeight = modalRef.current.offsetHeight;
      
      // Calculate center position (viewport center - half of modal size)
      const centerX = (window.innerWidth / 2) - (modalWidth / 2);
      const centerY = (window.innerHeight / 2) - (modalHeight / 2);
      
      setPosition({ x: centerX, y: centerY });
    }
  }, [position]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    
    // Record the initial mouse position and current modal position
    setStartPos({
      mouseX: e.clientX,
      mouseY: e.clientY,
      modalX: position.x,
      modalY: position.y
    });
    
    setIsDragging(true);
  };
  
  // Handle clicks outside the modal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Only process if we're not dragging
      if (isDragging) return;
      
      // If the click is on the wrapper but not on the modal, close it
      if (wrapperRef.current && modalRef.current) {
        if (wrapperRef.current.contains(e.target) && !modalRef.current.contains(e.target)) {
          onClose();
        }
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose, isDragging]);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      // Calculate the distance the mouse has moved
      const deltaX = e.clientX - startPos.mouseX;
      const deltaY = e.clientY - startPos.mouseY;
      
      // Update the modal position
      setPosition({
        x: startPos.modalX + deltaX,
        y: startPos.modalY + deltaY
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPos]);

  const handleScheduleInterview = () => {
    onScheduleInterview(applicant);
  };

  const handleRejectApplicant = () => {
    onReject();
  };

  if (loading) {
    return (
      <div className="avp-wrapper" ref={wrapperRef}>
        <div className="avp-modal" ref={modalRef}>
          <p>Loading applicant details...</p>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="avp-wrapper" ref={wrapperRef}>
        <div className="avp-modal" ref={modalRef}>
          <p>Failed to load applicant details.</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="avp-wrapper" ref={wrapperRef}>
      <div
        className="avp-modal"
        ref={modalRef}
        style={{ 
          position: 'absolute',
          left: position.x ? `${position.x}px` : '50%',
          top: position.y ? `${position.y}px` : '50%',
          transform: position.x === null ? 'translate(-50%, -50%)' : 'none'
        }}
      >
        <div className="avp-header" onMouseDown={handleMouseDown} style={{ cursor: 'move' }}>
          <h2>Applicant Viewing</h2>
          <button className="avp-close" onClick={onClose}>✕</button>
        </div>

        <div className="avp-profile-section">
          {applicant.profilePicTitle && applicant.profilePicTitle !== 'defaultPerson.png' ? (
            <img src={`/images/${applicant.profilePicTitle}`} alt="Applicant" />
          ) : (
            <div 
              className="at-avatar-letter" 
              style={{
                backgroundColor: applicant.firstName ? 
                  `${applicant.firstName.charAt(0).toUpperCase() === 'A' ? '#FF5733' : 
                    applicant.firstName.charAt(0).toUpperCase() === 'B' ? '#33FF57' : '#3357FF'}` : '#6c757d',
                color: '#ffffff',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '2rem',
                margin: '0 auto'
              }}
            >
              {applicant.firstName ? applicant.firstName.charAt(0).toUpperCase() : '?'}
            </div>
          )}
        </div>

        <div className="avp-fields">
          <div className="avp-field-group">
            {/* Removed Job Post ID field */}
            <div style={{ width: '100%' }}>
              <label>Application Status</label>
              <input 
                type="text" 
                value={applicant.applicationStatus || 'N/A'} 
                readOnly 
                style={{
                  backgroundColor: 
                    applicant.applicationStatus?.toLowerCase() === 'active' ? '#e8f5e9' : 
                    applicant.applicationStatus?.toLowerCase() === 'rejected' ? '#ffebee' : 
                    '#f5f5f5',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div className="avp-field-group">
            <div>
              <label>First Name</label>
              <input type="text" value={applicant.firstName || 'N/A'} readOnly />
            </div>
            <div>
              <label>Last Name</label>
              <input type="text" value={applicant.lastName || 'N/A'} readOnly />
            </div>
          </div>

          <div className="avp-email-field">
            <label>Email</label>
            <input type="email" value={applicant.email || 'N/A'} readOnly />
          </div>
        </div>

        <div className="avp-credentials">
          <div className="avp-credentials-header">
            <div>
              <div>
                <p className="avp-company-name">{applicant.company || 'No Company Information'}</p>
                <p className="avp-location">{applicant.workSetup || 'N/A'}</p>
              </div>
            </div>
            <div className="avp-role-details">
              <p className="avp-role-title">{applicant.primaryRole || 'No Role Specified'}</p>
              <p className="avp-experience">Experience: {applicant.experience || 'N/A'} years</p>
            </div>
          </div>

          <div className="avp-credentials-list">
            {applicant.credential ? (
              <div className="avp-credential-item">{applicant.credential}</div>
            ) : (
              <p>No credentials available.</p>
            )}
          </div>
        </div>

        <div className="avp-buttons">
          <button 
            className="avp-reject" 
            onClick={handleRejectApplicant}
            disabled={applicant.applicationStatus?.toLowerCase() === 'rejected'}
          >
            Reject Applicant
          </button>
          <button 
            className="avp-interview" 
            onClick={handleScheduleInterview}
            disabled={applicant.applicationStatus?.toLowerCase() === 'rejected'}
          >
            Schedule Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantViewingPopupForm;