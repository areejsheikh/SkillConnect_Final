import React, { useState, useEffect } from 'react';
import './styles/ManageJobPostings.css';
import { FaEllipsisV } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import manageJobServices from '../services/managejobServices';

const EyeIcon = ({ onClick }) => (
  <svg
    className="mjp-eye-icon"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="18"
    height="18"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const ManageJobPostingsForm = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([]);
  const [menuVisible, setMenuVisible] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (id) => {
    setMenuVisible(menuVisible === id ? null : id);
  };

  const handleEyeIconClick = async (jobPostID) => {
    try {
      console.log(`Fetching applicants for jobPostID: ${jobPostID}`);
      const response = await manageJobServices.getAllApplicantsDetailsForJob(jobPostID);
      console.log('Applicants details received:', response);
  
      // Navigate to the applicant tracking page with the fetched applicants AND jobPostID
      navigate(`/applicant-tracking/${jobPostID}/${recruiterId}`, {
        state: { 
          jobPostID: jobPostID,  // Pass jobPostID explicitly
          applicants: response.data // Pass applicants data to the next page
        },
      });
    } catch (error) {
      console.error('Error fetching applicants details:', error);
    }
  };

  useEffect(() => {
    const fetchJobsByRecruiter = async () => {
      try {
        const response = await manageJobServices.getJobsByRecruiter(recruiterId);
        console.log('Fetched Jobs by Recruiter:', response);
        setJobs(response.data || []);
      } catch (error) {
        console.error('Failed to fetch jobs by recruiter:', error);
      }
    };

    fetchJobsByRecruiter();
  }, [recruiterId]);

  return (
    <div className="manage-job-postings-page">
      <section className="mjp-table-section">
        <div className="mjp-table-header">
          <h2>Manage Job Postings</h2>
          <p>Edit, close, or delete your posted job listings</p>
        </div>
        <table className="mjp-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Job Postings</th>
              <th>For Company</th>
              <th>Job Details</th>
              <th>Number of Applicants</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.jobPostID}>
                  <td>{job.jobPostID}</td>
                  <td>{job.title}</td>
                  <td>{job.company}</td>
                  <td>{job.jobDescrip}</td>
                  <td className="mjp-applicant-cell">
                    <div className="mjp-applicant-content">
                      <div className="mjp-applicant-data">{job.applicantsCount}</div>
                      <div className="mjp-icons">
                        <EyeIcon onClick={() => handleEyeIconClick(job.jobPostID)} />
                        <div className="mjp-dots-container">
                          <FaEllipsisV
                            className="mjp-dots-icon"
                            onClick={() => toggleMenu(job.jobPostID)}
                          />
                          {menuVisible === job.jobPostID && (
                            <div className="mjp-dots-menu">
                              <p>Edit</p>
                              <p>Close</p>
                              <p>Delete</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No jobs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default ManageJobPostingsForm;