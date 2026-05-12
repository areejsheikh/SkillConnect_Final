import React, { useState } from 'react';
import './styles/SignUp.css';
import { createUser } from '../services/userServices'; // Import the createUser function
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Popup from './Popup'; // Import the reusable Popup component

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'Recruiter',
  });

  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' });

  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      console.log('Signup successful:', response);

      // Store user information in localStorage for automatic login
      localStorage.setItem('userToken', response.token || 'user-token');
      localStorage.setItem('userRole', formData.role.toLowerCase());
      localStorage.setItem('userId', response.user.userID);

      // Show success popup
      setPopup({
        visible: true,
        title: 'Signup Successful',
        message: 'Your account has been created successfully.',
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
      console.error('Signup failed:', error);
      
      // Extract the specific error message from the backend
      let errorMessage = 'An error occurred during signup. Please try again.';
      
      if (error.message) {
        // Check for specific error messages from the API
        if (error.message.includes('User with this email already exists')) {
          errorMessage = 'An account with this email already exists. Please use a different email or login.';
        } else if (error.message.includes('Password must be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Failed to create user')) {
          // Extract the specific message from the error
          const match = error.message.match(/Failed to create user: (.*)/);
          errorMessage = match ? match[1] : errorMessage;
        }
      }

      // Show error popup with the specific message
      setPopup({
        visible: true,
        title: 'Signup Failed',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      {/* Logo at the top */}
      <div className="form-logo">
        <img src="/logoskill.png" alt="SkillConnect Logo" />
      </div>
      <h2>Create your account</h2>
      <p>Registration is easy</p>

      <label>Email address *</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
      />

      <label>Full Name *</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
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
            value="JobSeeker"
            checked={formData.role === 'JobSeeker'}
            onChange={handleChange}
          />
          JobSeeker
        </label>
      </div>

      <p className="terms">
        By clicking Register or Continue with Google, Facebook, or Apple, you
        agree to SkillConnect's Terms of Use and Privacy Policy
      </p>

      <button type="submit" className="register-button">
        Register
      </button>

      <div className="or-divider">OR</div>

      <button type="button" className="social-button google">
        Continue with Google
      </button>
      <button type="button" className="social-button facebook">
        Continue with Facebook
      </button>

      <p className="footer-text">
        SkillConnect may send you communications; you may change your
        preferences in your account settings.
      </p>

      {/* Render Popup */}
      {popup.visible && (
        <Popup
          title={popup.title}
          message={popup.message}
          buttonText={popup.buttonText}
          onButtonClick={popup.onButtonClick}
        />
      )}
    </form>
  );
};

export default SignUpForm;