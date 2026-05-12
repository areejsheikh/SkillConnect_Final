import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/LogIn.css';
import { logUserIn } from '../services/userServices'; // Import the logUserIn function
import Popup from './Popup'; // Import the reusable Popup component

const LogInForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Recruiter',
    staySignedIn: false,
  });

  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });
  const [isForgotPopupVisible, setForgotPopupVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await logUserIn(formData);
      console.log('Login successful:', response);

      // Store user information in localStorage or sessionStorage based on staySignedIn option
      const storageMethod = formData.staySignedIn ? localStorage : sessionStorage;
      storageMethod.setItem('userToken', response.token || 'user-token'); 
      storageMethod.setItem('userRole', formData.role.toLowerCase());
      storageMethod.setItem('userId', response.user.userID);

      // Show success popup
      setPopup({
        visible: true,
        title: 'Login Successful',
        message: 'You have successfully logged in to SkillConnect.',
        buttonText: 'Continue',
        onButtonClick: () => {
          // Redirect based on role
          if (formData.role === 'Recruiter') {
            navigate(`/manage-job-postings/${response.user.userID}`);
          } else {
            navigate(`/dashboard/${response.user.userID}`);
          }
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      
      // Extract the specific error message from the backend
      let errorMessage = 'Invalid email or password. Please try again.';
      
      if (error.message) {
        // Check for specific error messages from the API
        if (error.message.includes('User not found')) {
          errorMessage = 'User not found. Please check your email address.';
        } else if (error.message.includes('Invalid password')) {
          errorMessage = 'The password you entered is incorrect.';
        } else if (error.message.includes('Invalid role')) {
          errorMessage = 'Please select the correct role for this user.';
        } else if (error.message.includes('Failed to login user')) {
          // Extract the specific message from the error
          const match = error.message.match(/Failed to login user : (.*)/);
          errorMessage = match ? match[1] : errorMessage;
        }
      }

      // Show error popup with the specific message
      setPopup({
        visible: true,
        title: 'Login Failed',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    }
  };

  const handleForgot = (event) => {
    event.preventDefault();
    setForgotPopupVisible(true); // Show the popup when the link is clicked
  };

  const handleForgotClosePopup = () => {
    setForgotPopupVisible(false); // Close the popup when the button is clicked
  };
  
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="login-box">
      {/* Logo */}
      <div className="form-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to continue</h2>

        <label>Email address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="Recruiter"
              checked={formData.role === 'Recruiter'}
              onChange={handleChange}
            />
            Recruiter
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Jobseeker"
              checked={formData.role === 'Jobseeker'}
              onChange={handleChange}
            />
            JobSeeker
          </label>
        </div>

        <div className="additional-options">
          <label>
            <input
              type="checkbox"
              name="staySignedIn"
              checked={formData.staySignedIn}
              onChange={handleChange}
            />
            Stay signed in
          </label>
          <a href="/forgot-password" 
            className="forgot-password" 
            onClick={handleForgot}>
            Forgot your password?
          </a>
           {/* Conditionally render the Popup component */}
          {isForgotPopupVisible && (
          <Popup
            title="Forgot Your Password?"
            message="An Email with instructions to reset your password has been sent to your registered email address."
            buttonText="Ok"
            onButtonClick={handleForgotClosePopup}
          />
      )}
        </div>

        <button type="submit" className="login-button">
          Log in
        </button>

        <div className="signup-section">
          <p className="signup-text">Not a member? No Worries,</p>
          <button
            type="button"
            className="signup-button"
            onClick={handleSignupRedirect}
          >
            Sign-Up to SkillConnect
          </button>
        </div>

        <div className="or-divider">
          <span>OR</span>
        </div>

        <button type="button" className="social-button google">
          Continue with Google
        </button>
        <button type="button" className="social-button facebook">
          Continue with Facebook
        </button>

        <p className="footer-text">
          SkillConnect may send you communications;
          you may change your preference in your account settings.
        </p>
      </form>

      {/* Render Popup */}
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

export default LogInForm;