import React, { useState, useEffect } from 'react';
import './styles/ApplicantTracking.css';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ApplicantViewingPopupForm from './ApplicantViewingPopupForm';
import manageJobServices from '../services/managejobServices';
import { rejectApplicant } from '../services/processApplicantsServices';

const ApplicantTrackingForm = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { jobPostID, recruiterId } = useParams();
  
  const passedApplicants = location.state?.applicants || [];
  
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        if (!jobPostID) {
          console.error('jobPostID is undefined. Cannot fetch applicants.');
          return;
        }

        console.log(`Fetching applicants for jobPostID: ${jobPostID}`);
        const response = await manageJobServices.getAllApplicantsDetailsForJob(jobPostID);
        console.log('Applicants details received:', response);

        if (response.data && Array.isArray(response.data)) {
          setApplicants(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching applicants details:', error);
      }
    };

    // Always fetch fresh data on page load/reload
    fetchApplicants();
    
    // If we have passed applicants, use them initially for faster rendering
    // while the API call completes
    if (passedApplicants.length > 0) {
      console.log('Using applicants passed from previous screen while fetching fresh data:', passedApplicants);
      setApplicants(passedApplicants);
    }
    
  }, [jobPostID, passedApplicants]);

  const handleViewApplicant = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleRejectApplicant = async () => {
    if (!selectedApplicant || !jobPostID) {
      console.error('Missing selectedApplicant or jobPostID');
      return;
    }
    
    try {
      await rejectApplicant(jobPostID, selectedApplicant.applicantID);
      
      // Update the local state to reflect the rejection
      setApplicants(prevApplicants => 
        prevApplicants.map(app => 
          app.applicantID === selectedApplicant.applicantID 
            ? {...app, applicationStatus: 'Rejected'} 
            : app
        )
      );
      
      alert('Applicant rejected successfully.');
      setSelectedApplicant(null); // Close the popup
    } catch (error) {
      console.error('Failed to reject applicant:', error);
      alert('Failed to reject applicant. Please try again.');
    }
  };

  const handleScheduleInterview = (applicant) => {
    // Updated to include jobPostID in the URL path for better access
    console.log('Scheduling interview for applicant with ID:', applicant.applicantID);
    console.log('Current job post ID:', jobPostID);
    
    navigate(`/interview-scheduling/${recruiterId}/${jobPostID}`, { 
      state: { 
        applicant,
        jobPostID: parseInt(jobPostID) // Ensure it's passed as a number
      } 
    });
  };

  const handleClosePopup = () => {
    setSelectedApplicant(null);
  };

  // Function to determine status color based on application status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#28a745'; // Green
      case 'pending':
        return '#ffc107'; // Yellow
      case 'rejected':
        return '#dc3545'; // Red
      case 'hired':
        return '#17a2b8'; // Blue
      default:
        return '#6c757d'; // Gray for unknown status
    }
  };

  return (
    <div className="applicant-tracking-page">
      {/* Job Info */}
      <div className="at-job-info">
        <h3>Listed Position: Junior Developer</h3>
        <p>Number of Applicants: {applicants.length}</p>
      </div>

      {/* Applicants List */}
      <div className="at-applicant-list">
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <div key={applicant.applicantID} className="at-applicant-card">
              <div className="at-applicant-profile">
                {applicant.profilePicTitle && applicant.profilePicTitle !== 'defaultPerson.png' ? (
                  <img
                    src={`/images/${applicant.profilePicTitle}`}
                    alt={`${applicant.firstName} ${applicant.lastName}`}
                  />
                ) : (
                  <div 
                    className="at-avatar-letter"
                    style={{ 
                      backgroundColor: applicant.firstName ? 
                        `${applicant.firstName.charAt(0).toUpperCase() === 'A' ? '#FF5733' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'B' ? '#33FF57' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'C' ? '#3357FF' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'D' ? '#F033FF' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'E' ? '#FF33A8' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'F' ? '#33FFF3' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'G' ? '#FFB533' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'H' ? '#B533FF' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'I' ? '#33FF8A' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'J' ? '#FF338A' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'K' ? '#338AFF' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'L' ? '#FF5733' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'M' ? '#33FF57' : 
                          applicant.firstName.charAt(0).toUpperCase() === 'N' ? '#3357FF' : '#6c757d'}` : '#6c757d',
                      color: '#ffffff',
                      width: '45px',
                      height: '45px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >
                    {applicant.firstName ? applicant.firstName.charAt(0).toUpperCase() : ''}
                  </div>
                )}
                <div>
                  <strong>{`${applicant.firstName} ${applicant.lastName}`}</strong>
                  <p>{applicant.company}</p>
                </div>
              </div>
              <div className="at-applicant-role">
                <strong>{applicant.primaryRole}</strong>
                <p>Experience: {applicant.experience} years</p>
              </div>
              <div className="at-applicant-status">
                <strong>Applicant Status</strong>
                <p>
                  <span 
                    className="at-status-badge"
                    style={{
                      backgroundColor: getStatusColor(applicant.applicationStatus),
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {applicant.applicationStatus}
                  </span>
                </p>
              </div>
              <div className="at-applicant-action">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  width="20"
                  height="20"
                  onClick={() => handleViewApplicant(applicant)}
                  style={{ cursor: 'pointer' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p>No applicants found for this job.</p>
        )}
      </div>

      {/* Applicant Viewing Popup */}
      {selectedApplicant && (
        <ApplicantViewingPopupForm
          applicant={selectedApplicant}
          onClose={handleClosePopup}
          onReject={handleRejectApplicant}
          onScheduleInterview={handleScheduleInterview}
        />
      )}
    </div>
  );
};

export default ApplicantTrackingForm;