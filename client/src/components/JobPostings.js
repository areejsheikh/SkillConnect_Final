import React, { useEffect, useState, useRef } from 'react';
import './styles/JobPostings.css';
import { FaMapMarkerAlt, FaFilter, FaRegBookmark } from 'react-icons/fa';
import jobService from '../services/jobServices';
import { useParams, useNavigate } from 'react-router-dom';
import Popup from './Popup'; // Import the reusable Popup component

const JobCard = ({ job, userId, onSaveJob, getCompanyLogo }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/job-details/${job.jobPostID}/${userId}`);
  };

  return (
    <div className="job-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="job-card-header">
        <img
          src={getCompanyLogo(job.company)}
          alt="Company Logo"
          className="company-logo"
        />
      </div>
      <h3 className="job-title">{job.title}</h3>
      <p className="salary">Salary: {job.salaryRange || 'Not specified'}</p>
      <p className="company">{job.company}</p>
      <p className="location">
        <FaMapMarkerAlt className="icon" />
        {job.jobLocation || 'Location not specified'}
      </p>
      <button
        className="bookmark"
        onClick={(e) => {
          e.stopPropagation();
          onSaveJob(job.jobPostID);
        }}
      >
        <FaRegBookmark />
      </button>
    </div>
  );
};

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false); // State to toggle filter modal
  const [filters, setFilters] = useState({
    jobType: '',
    salaryRange: '',
  });
  const [popup, setPopup] = useState({ visible: false, title: '', message: '', buttonText: '' }); // Popup state
  const { userId } = useParams();
  const filterRef = useRef(null); // Reference for the filter modal

  const companyImages = [
    { name: 'facebook', src: `${process.env.PUBLIC_URL}/facebook.icon.png` },
    { name: 'google', src: `${process.env.PUBLIC_URL}/google.icon.png` },
    { name: 'instagram', src: `${process.env.PUBLIC_URL}/instagram.icon.jpg` },
  ];

  const getCompanyLogo = (companyName) => {
    const matchingImage = companyImages.find((image) =>
      companyName?.toLowerCase().includes(image.name)
    );
    return matchingImage ? matchingImage.src : `${process.env.PUBLIC_URL}/logoskill.png`;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobService.getAllJobs();
        setJobs(response || []);
        setFilteredJobs(response || []);
      } catch (error) {
        console.error('Failed to load jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false); // Close the filter modal if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveJob = async (jobID) => {
    try {
      const response = await jobService.saveJob(jobID, userId);
      console.log(`Job ${jobID} saved successfully:`, response);

      // Show popup with the actual message from the controller
      setPopup({
        visible: true,
        title: response.success ? 'Success' : 'Info',
        message: response.message || 'Job saved successfully!',
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    } catch (error) {
      console.error(`Failed to save job ${jobID}:`, error);
      
      // Try to extract error message from the response
      let errorMessage = 'Failed to save job. Please try again.';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show error popup with the actual error message
      setPopup({
        visible: true,
        title: 'Error',
        message: errorMessage,
        buttonText: 'Close',
        onButtonClick: () => setPopup({ visible: false }),
      });
    }
  };

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(searchTitle.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchTitle.toLowerCase());
      const matchesLocation = job.jobLocation.toLowerCase().includes(searchLocation.toLowerCase());
      const matchesJobType = filters.jobType ? job.jobType === filters.jobType : true;
      
      // Parse salary range properly considering "$85,000 - $110,000" format
      const matchesSalaryRange = filters.salaryRange
        ? (() => {
            if (!job.salaryRange) return false;
            
            // Extract min salary by taking the first part before the dash, removing $ and commas
            const minSalaryStr = job.salaryRange.split('-')[0].trim().replace('$', '').replace(/,/g, '');
            const minSalary = parseInt(minSalaryStr, 10);
            
            if (isNaN(minSalary)) return false;
            
            if (filters.salaryRange === '0-50000') return minSalary <= 50000;
            if (filters.salaryRange === '50000-100000') return minSalary > 50000 && minSalary <= 100000;
            if (filters.salaryRange === '100000+') return minSalary > 100000;
            return true;
          })()
        : true;

      return matchesTitle && matchesLocation && matchesJobType && matchesSalaryRange;
    });
    setFilteredJobs(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger search when Enter is pressed
    }
  };

  return (
    <section className="job-postings">
      <div className="job-header">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search by Job title, Position, Keyword..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            onKeyDown={handleKeyDown} // Trigger search on Enter
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            placeholder="City, state or zip code"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={handleKeyDown} // Trigger search on Enter
          />
        </div>
        <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
          <FaFilter /> Filters
        </button>
        <button className="find-btn" onClick={handleSearch}>
          Find Job
        </button>
      </div>

      {showFilters && (
        <div className="filter-modal" ref={filterRef}>
          <h4>Filter Jobs</h4>
          <div className="filter-group">
            <label>Job Type</label>
            <select name="jobType" value={filters.jobType} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Salary Range</label>
            <select name="salaryRange" value={filters.salaryRange} onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="0-50000">Up to $50,000</option>
              <option value="50000-100000">$50,000 - $100,000</option>
              <option value="100000+">$100,000+</option>
            </select>
          </div>
          <button className="apply-filters-btn" onClick={handleSearch}>
            Apply Filters
          </button>
        </div>
      )}

      {/* Popup */}
      {popup.visible && (
        <Popup
          title={popup.title}
          message={popup.message}
          buttonText={popup.buttonText}
          onButtonClick={popup.onButtonClick}
        />
      )}

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="job-grid">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <JobCard
                key={index}
                job={job}
                userId={userId}
                onSaveJob={handleSaveJob}
                getCompanyLogo={getCompanyLogo}
              />
            ))
          ) : (
            <p>No job postings available.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default JobPostings;