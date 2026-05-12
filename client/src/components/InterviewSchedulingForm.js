import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/InterviewScheduling.css';
import { scheduleInterview, rejectApplicant } from '../services/processApplicantsServices';
import Popup from './Popup'; // Import the Popup component

const InterviewSchedulingForm = ({ applicant, jobPostID }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });
  const [formData, setFormData] = useState({
    mode: 'online',
    scheduled_at: '',
    notes: ''
  });

  useEffect(() => {
    // Set a default date/time (tomorrow at current time)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format as YYYY-MM-DDThh:mm required by datetime-local input
    const formattedDate = tomorrow.toISOString().slice(0, 16);
    
    setFormData(prev => ({
      ...prev,
      scheduled_at: formattedDate
    }));

    console.log('InterviewSchedulingForm received applicant:', applicant);
    console.log('Job ID received by form:', jobPostID);
  }, [applicant, jobPostID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.scheduled_at) {
      setError('Please select a date and time for the interview');
      return;
    }
    
    // Validate job ID
    if (!jobPostID) {
      setError('Missing job ID. Please try again from the applicant tracking page.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Format date time to match the required format: "YYYY-MM-DD HH:MM:SS"
      const dateTime = new Date(formData.scheduled_at);
      const formattedDateTime = dateTime.toISOString().slice(0, 19).replace('T', ' ');
      
      // Prepare interview details with explicit parseInt for jobID
      const interviewDetails = {
        jobID: parseInt(jobPostID), // Ensure jobID is a number
        scheduled_at: formattedDateTime,
        mode: formData.mode.toLowerCase(),
        notes: formData.notes || 'No additional notes'
      };
      
      console.log('Scheduling interview with details:', interviewDetails);
      console.log('For applicant ID:', applicant.applicantID);
      
      // Call the service to schedule the interview
      const response = await scheduleInterview(applicant.applicantID, interviewDetails);
      console.log('Interview scheduling response:', response);
      
      // Show success popup instead of alert
      setPopup({
        visible: true,
        title: 'Success',
        message: 'Interview scheduled successfully!',
        buttonText: 'OK',
        onButtonClick: () => {
          setPopup({ visible: false });
          navigate(-1); // Navigate back after scheduling
        }
      });
    } catch (error) {
      console.error('Error scheduling interview:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to schedule interview. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error popup instead of alert
      setPopup({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false })
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle applicant rejection with popup
  const handleReject = async () => {
    if (!jobPostID) {
      setPopup({
        visible: true,
        title: 'Error',
        message: 'Missing job ID. Please try again from the applicant tracking page.',
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false })
      });
      return;
    }
    try {
      setIsSubmitting(true);
      await rejectApplicant(parseInt(jobPostID), applicant.applicantID);
      setPopup({
        visible: true,
        title: 'Applicant Rejected',
        message: 'The applicant has been rejected successfully.',
        buttonText: 'OK',
        onButtonClick: () => {
          setPopup({ visible: false });
          navigate(-1); // Go back after rejection
        }
      });
    } catch (error) {
      let errorMessage = 'Failed to reject applicant. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setPopup({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false })
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="is-modal">
      <div className="is-header">
        <h2>Schedule Interview</h2>
        <button className="is-close" onClick={handleClose}>&times;</button>
      </div>

      <form className="is-form" onSubmit={handleSubmit}>
        {error && (
          <div className="is-error" style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <div className="is-row">
          <div className="is-field">
            <label>First Name</label>
            <input type="text" value={applicant?.firstName || ''} readOnly />
          </div>
          <div className="is-field">
            <label>Last Name</label>
            <input type="text" value={applicant?.lastName || ''} readOnly />
          </div>
        </div>

        <div className="is-row">
          <div className="is-field">
            <label>Email</label>
            <input type="email" value={applicant?.email || ''} readOnly />
          </div>
        </div>

        {/* Hidden job ID field for debugging */}
        <input type="hidden" id="debug-job-id" value={jobPostID || ''} />

        <div className="is-row">
          <div className="is-field">
            <label>Interview Mode</label>
            <select name="mode" value={formData.mode} onChange={handleInputChange}>
              <option value="online">Online</option>
              <option value="onsite">Onsite</option>
              <option value="phone">Phone</option>
            </select>
          </div>
          <div className="is-field">
            <label>Select Date & Time <span style={{ color: 'red' }}>*</span></label>
            <input 
              type="datetime-local" 
              name="scheduled_at"
              value={formData.scheduled_at}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="is-field">
          <label>Additional Notes</label>
          <textarea 
            name="notes" 
            rows="3"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add any additional notes or instructions for the interview"
          ></textarea>
        </div>

        <div className="is-actions">
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="confirm-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Confirm'}
          </button>
          <button
            type="button"
            className="reject-btn"
            style={{ marginLeft: '10px', backgroundColor: '#e57373', color: '#fff' }}
            onClick={handleReject}
            disabled={isSubmitting}
          >
            Reject Applicant
          </button>
        </div>
      </form>

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
};

export default InterviewSchedulingForm;