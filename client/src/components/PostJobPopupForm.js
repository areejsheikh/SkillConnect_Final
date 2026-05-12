import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/PostJobPopup.css';
import manageJobServices from '../services/managejobServices';

const PostJobPopupForm = ({ onCancel }) => {
  const { recruiterId } = useParams(); // Get recruiterId from URL
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Form state with all required fields
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contactEmail: '',
    primaryRole: 'Full-Stack Developer',
    salaryRange: '',
    eduReq: 'Graduation',
    jobSetup: 'remote',
    jobDescrip: '',
    jobReqs: '',
    jobDesirables: '',
    jobBenefits: '',
    jobLocation: ''
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validate form data
      if (!formData.title || !formData.company || !formData.jobDescrip) {
        throw new Error('Please fill in all required fields: Job title, Company, and Description');
      }

      // Format salary range if needed
      let formattedSalary = formData.salaryRange;
      if (formattedSalary && !formattedSalary.includes('-') && !formattedSalary.includes(',')) {
        // Add proper formatting if it's just numbers
        formattedSalary = `${formattedSalary} - ${parseInt(formattedSalary) + 20000}`;
      }

      // Determine job level more accurately
      let jobLevel;
      if (formData.title.toLowerCase().includes('senior')) {
        jobLevel = 'Senior-Level';
      } else if (formData.title.toLowerCase().includes('junior')) {
        jobLevel = 'Entry-Level';
      } else {
        jobLevel = 'Mid-Level'; // Default to mid-level
      }

      // Prepare job data for submission
      const jobData = {
        title: formData.title,
        company: formData.company,
        jobDescrip: formData.jobDescrip,
        jobReqs: formData.jobReqs || 'No specific requirements', // Provide defaults for important fields
        jobDesirables: formData.jobDesirables || 'No specific desirables',
        jobBenefits: formData.jobBenefits || 'Standard benefits package',
        jobLocation: formData.jobLocation || 'Remote',
        salaryRange: formattedSalary || 'Competitive salary',
        jobSetup: formData.jobSetup,
        eduReq: formData.eduReq,
        jobLevel: jobLevel,
        contactEmail: formData.contactEmail || 'contact@company.com',
        primaryRole: formData.primaryRole,
        // Add userID explicitly since this might be required by the backend
        userID: parseInt(recruiterId)
      };

      console.log('Posting job with data:', jobData);
      console.log('For recruiter ID:', recruiterId);

      // Submit the job data to the backend
      const response = await manageJobServices.postJob(recruiterId, jobData);
      console.log('Job posted successfully:', response);
      
      setSuccessMessage('Job posted successfully!');
      
      // Reset the form after successful submission
      setFormData({
        title: '',
        company: '',
        contactEmail: '',
        primaryRole: 'Full-Stack Developer',
        salaryRange: '',
        eduReq: 'Graduation',
        jobSetup: 'remote',
        jobDescrip: '',
        jobReqs: '',
        jobDesirables: '',
        jobBenefits: '',
        jobLocation: ''
      });
      
      // Redirect to manage jobs after a short delay
      setTimeout(() => {
        navigate(`/manage-job-postings/${recruiterId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error posting job:', error);
      setErrorMessage(error.message || 'Failed to post job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      {successMessage && (
        <div className="success-message" style={{ color: 'green', padding: '10px', backgroundColor: '#e8f5e9', marginBottom: '15px', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message" style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', marginBottom: '15px', borderRadius: '4px' }}>
          {errorMessage}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label>Job Title <span style={{ color: 'red' }}>*</span></label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g. Senior Software Engineer" 
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>For Company <span style={{ color: 'red' }}>*</span></label>
          <input 
            type="text" 
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="e.g. NoTech Solutions" 
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Your Contact Email</label>
        <input 
          type="email" 
          name="contactEmail"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="e.g. example@gmail.com" 
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Primary Role</label>
          <select 
            name="primaryRole"
            value={formData.primaryRole}
            onChange={handleInputChange}
          >
            <option>Full-Stack Developer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Data Analyst</option>
            <option>Data Scientist</option>
            <option>Machine Learning Engineer</option>  
            <option>DevOps Engineer</option>
            <option>UI/UX Designer</option>
            <option>IT Support Specialist</option>
            <option>Technical Writer</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Expected Salary Range (USD)</label>
          <input 
            type="text" 
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleInputChange}
            placeholder="70,000 - 100,000" 
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Education Requirement</label>
          <select 
            name="eduReq"
            value={formData.eduReq}
            onChange={handleInputChange}
          >
            <option>Graduation</option>
            <option>Masters</option>
            <option>PhD</option>
          </select>
        </div>
        <div className="form-group">
          <label>Job Set-up</label>
          <select 
            name="jobSetup"
            value={formData.jobSetup}
            onChange={handleInputChange}
          >
            <option>remote</option>
            <option>on-site</option>
            <option>hybrid</option>
            <option>freelance</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Job Location</label>
        <input 
          type="text" 
          name="jobLocation"
          value={formData.jobLocation}
          onChange={handleInputChange}
          placeholder="e.g. New York, NY or Remote" 
        />
      </div>

      <div className="form-group">
        <label>Job Description <span style={{ color: 'red' }}>*</span></label>
        <textarea 
          rows="4" 
          name="jobDescrip"
          value={formData.jobDescrip}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Requirements</label>
        <textarea 
          rows="3" 
          name="jobReqs"
          value={formData.jobReqs}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Desirables</label>
        <textarea 
          rows="3" 
          name="jobDesirables"
          value={formData.jobDesirables}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Benefits</label>
        <textarea 
          rows="3" 
          name="jobBenefits"
          value={formData.jobBenefits}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="confirm-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Confirm'}
        </button>
      </div>
    </form>
  );
};

export default PostJobPopupForm;