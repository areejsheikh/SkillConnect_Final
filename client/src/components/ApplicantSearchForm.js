import React, { useState, useEffect } from "react";
import "./styles/ApplicantSearch.css";
import { fetchAllPotentialApplicants } from "../services/processApplicantsServices";
import { FaSearch } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function ApplicantSearchForm() {
  const { recruiterId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    experience: null,
    company: null,
    workSetup: null,
    role: null
  });
  
  console.log('ApplicantSearchForm rendered, recruiterId:', recruiterId);

  // Dummy data for when API fetch fails
  const dummyApplicants = [
    {
      applicantID: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      company: "Google",
      experience: "5",
      primaryRole: "Software Engineer",
      workSetup: "Remote",
      profilePicTitle: null
    },
    {
      applicantID: 2,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      company: "Facebook",
      experience: "3",
      primaryRole: "Data Scientist",
      workSetup: "Hybrid",
      profilePicTitle: null
    },
    {
      applicantID: 3,
      firstName: "Bob",
      lastName: "Johnson",
      email: "bob.johnson@example.com",
      company: "Unemployed",
      experience: "2",
      primaryRole: "UI/UX Designer",
      workSetup: "On-Site",
      profilePicTitle: null
    },
    {
      applicantID: 4,
      firstName: "Emma",
      lastName: "Williams",
      email: "emma.williams@example.com",
      company: "Amazon",
      experience: "7",
      primaryRole: "Full-Stack Developer",
      workSetup: "Remote",
      profilePicTitle: null
    },
    {
      applicantID: 5,
      firstName: "Carlos",
      lastName: "Rodriguez",
      email: "carlos@example.com",
      company: "Microsoft",
      experience: "10",
      primaryRole: "Senior Developer",
      workSetup: "Hybrid",
      profilePicTitle: null
    },
    {
      applicantID: 6,
      firstName: "Diana",
      lastName: "Chen",
      email: "diana@example.com",
      company: "Unemployed",
      experience: "1",
      primaryRole: "Junior Developer",
      workSetup: "Remote",
      profilePicTitle: null
    }
  ];

  // Process the jobSeekers array into the format we need
  const processJobSeekers = (jobSeekers) => {
    console.log('Processing jobSeekers:', jobSeekers);
    return jobSeekers.map(seeker => {
      // Get the profile and working status data
      const profile = seeker.seekerProfile || {};
      const workStatus = seeker.workingStatus || {};
      
      return {
        applicantID: seeker.userID,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        company: workStatus.company || 'Unemployed',
        experience: workStatus.experience || '0',
        primaryRole: workStatus.primaryRole || 'Not specified',
        workSetup: workStatus.workSetup || 'Not specified',
        profilePicTitle: profile.profilePicTitle || null
      };
    }).filter(a => a.firstName || a.lastName); // Filter out entries with no name
  };

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        setLoading(true);
        console.log('Starting to fetch applicants...');
        
        if (useMockData) {
          console.log('Using dummy data instead of API call');
          setTimeout(() => {
            console.log('Setting dummy data:', dummyApplicants);
            setApplicants(dummyApplicants);
            setFilteredApplicants(dummyApplicants);
            setLoading(false);
          }, 1000); // Simulate network delay
          return;
        }
        
        console.log('Calling fetchAllPotentialApplicants()...');
        const response = await fetchAllPotentialApplicants();
        console.log('API response received:', response);
        
        if (response && response.jobSeekers && Array.isArray(response.jobSeekers)) {
          // Process the response data to match our expected format
          const processedData = processJobSeekers(response.jobSeekers);
          console.log('Processed data:', processedData);
          
          setApplicants(processedData);
          setFilteredApplicants(processedData);
          console.log(`Successfully processed ${processedData.length} applicants`);
        } else {
          console.error('Invalid response format:', response);
          throw new Error("API returned unexpected data format");
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
        console.log("Falling back to dummy data due to API error");
        setError(
          <div>
            <p>Failed to load applicants from the server: {err.message}</p>
            <button 
              onClick={() => {
                console.log('User clicked to use dummy data');
                setUseMockData(true);
                setError(null);
              }}
              style={{ 
                padding: '8px 16px', 
                background: '#4285f4', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              Use Sample Data Instead
            </button>
          </div>
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplicants();
  }, [useMockData]);

  useEffect(() => {
    console.log('Filters or search changed, applying filters...');
    applyFilters();
  }, [activeFilters, searchQuery, applicants]);

  const applyFilters = () => {
    console.log('Applying filters:', activeFilters);
    console.log('Current search query:', searchQuery);
    
    let filtered = [...applicants];
    console.log(`Starting with ${filtered.length} applicants`);

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(applicant => 
        `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(query) ||
        (applicant.primaryRole && applicant.primaryRole.toLowerCase().includes(query))
      );
      console.log(`After search query filter: ${filtered.length} applicants remaining`);
    }

    // Apply experience filter
    if (activeFilters.experience) {
      const yearsRequired = parseInt(activeFilters.experience);
      filtered = filtered.filter(applicant => 
        applicant.experience && parseInt(applicant.experience) >= yearsRequired
      );
      console.log(`After experience filter: ${filtered.length} applicants remaining`);
    }

    // Apply company filter
    if (activeFilters.company) {
      if (activeFilters.company === 'Unemployed') {
        filtered = filtered.filter(applicant => 
          !applicant.company || applicant.company.trim() === '' || 
          applicant.company.toLowerCase() === 'unemployed'
        );
      } else {
        filtered = filtered.filter(applicant => 
          applicant.company && applicant.company.toLowerCase().includes(activeFilters.company.toLowerCase())
        );
      }
      console.log(`After company filter: ${filtered.length} applicants remaining`);
    }

    // Apply work setup filter
    if (activeFilters.workSetup) {
      filtered = filtered.filter(applicant => 
        applicant.workSetup && applicant.workSetup.toLowerCase().includes(activeFilters.workSetup.toLowerCase())
      );
      console.log(`After work setup filter: ${filtered.length} applicants remaining`);
    }

    // Apply role filter
    if (activeFilters.role) {
      filtered = filtered.filter(applicant => 
        applicant.primaryRole && applicant.primaryRole.toLowerCase().includes(activeFilters.role.toLowerCase())
      );
      console.log(`After role filter: ${filtered.length} applicants remaining`);
    }

    console.log(`Final filtered results: ${filtered.length} applicants`);
    setFilteredApplicants(filtered);
  };

  const handleFilterClick = (filterType, value) => {
    console.log(`Filter clicked: ${filterType} = ${value}`);
    
    // Toggle the filter on/off
    setActiveFilters(prev => {
      const newFilters = {
        ...prev,
        [filterType]: prev[filterType] === value ? null : value
      };
      console.log('Updated filters:', newFilters);
      return newFilters;
    });
  };

  const isFilterActive = (filterType, value) => {
    return activeFilters[filterType] === value;
  };

  if (loading) {
    console.log('Rendering loading state...');
    return <div className="loading-spinner">Loading applicants...</div>;
  }

  if (error) {
    console.log('Rendering error state...');
    return <div className="error-message">{error}</div>;
  }

  console.log(`Rendering ${filteredApplicants.length} applicants`);
  
  return (
    <div className="applicant-search-form">
      {/* Search Bar */}
      <div className="as-search-container">
        <div className="as-search-input-group">
          <FaSearch className="as-search-icon" />
          <input
            type="text"
            placeholder="Search by name or position..."
            value={searchQuery}
            onChange={(e) => {
              console.log('Search query changed:', e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="as-search-input"
          />
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="as-filters-container">
        <h3 className="as-filters-heading">Quick Filters</h3>
        <div className="as-filters-group">
          <div className="as-filter-column">
            <h4>Experience</h4>
            <div className="as-filter-row">
              <button 
                className={isFilterActive('experience', '1') ? 'active' : ''}
                onClick={() => handleFilterClick('experience', '1')}
              >
                Over One Year
              </button>
              <button 
                className={isFilterActive('experience', '2') ? 'active' : ''}
                onClick={() => handleFilterClick('experience', '2')}
              >
                Over Two Years
              </button>
              <button 
                className={isFilterActive('experience', '5') ? 'active' : ''}
                onClick={() => handleFilterClick('experience', '5')}
              >
                Over Five Years
              </button>
              <button 
                className={isFilterActive('experience', '10') ? 'active' : ''}
                onClick={() => handleFilterClick('experience', '10')}
              >
                Over Ten Years
              </button>
            </div>
          </div>

          <div className="as-filter-column">
            <h4>Currently Working</h4>
            <div className="as-filter-row">
              <button 
                className={isFilterActive('company', 'Amazon') ? 'active' : ''}
                onClick={() => handleFilterClick('company', 'Amazon')}
              >
                Amazon
              </button>
              <button 
                className={isFilterActive('company', 'Facebook') ? 'active' : ''}
                onClick={() => handleFilterClick('company', 'Facebook')}
              >
                Facebook
              </button>
              <button 
                className={isFilterActive('company', 'Google') ? 'active' : ''}
                onClick={() => handleFilterClick('company', 'Google')}
              >
                Google
              </button>
              <button 
                className={isFilterActive('company', 'Unemployed') ? 'active' : ''}
                onClick={() => handleFilterClick('company', 'Unemployed')}
              >
                Unemployed
              </button>
            </div>
          </div>

          <div className="as-filter-column">
            <h4>Previous Work Setup</h4>
            <div className="as-filter-row">
              <button 
                className={isFilterActive('workSetup', 'Remote') ? 'active' : ''}
                onClick={() => handleFilterClick('workSetup', 'Remote')}
              >
                Online/Remote
              </button>
              <button 
                className={isFilterActive('workSetup', 'On-Site') ? 'active' : ''}
                onClick={() => handleFilterClick('workSetup', 'On-Site')}
              >
                On-Site
              </button>
              <button 
                className={isFilterActive('workSetup', 'Hybrid') ? 'active' : ''}
                onClick={() => handleFilterClick('workSetup', 'Hybrid')}
              >
                Hybrid
              </button>
              <button 
                className={isFilterActive('workSetup', 'Freelance') ? 'active' : ''}
                onClick={() => handleFilterClick('workSetup', 'Freelance')}
              >
                Freelance
              </button>
            </div>
          </div>

          <div className="as-filter-column">
            <h4>Previous Work Roles</h4>
            <div className="as-filter-row">
              <button 
                className={isFilterActive('role', 'Data Scientist') ? 'active' : ''}
                onClick={() => handleFilterClick('role', 'Data Scientist')}
              >
                Data Scientist
              </button>
              <button 
                className={isFilterActive('role', 'Software Engineer') ? 'active' : ''}
                onClick={() => handleFilterClick('role', 'Software Engineer')}
              >
                Software Engineer
              </button>
              <button 
                className={isFilterActive('role', 'Full-Stack') ? 'active' : ''}
                onClick={() => handleFilterClick('role', 'Full-Stack')}
              >
                Full-Stack Developer
              </button>
              <button 
                className={isFilterActive('role', 'Designer') ? 'active' : ''}
                onClick={() => handleFilterClick('role', 'Designer')}
              >
                UI/UX Designer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Heading */}
      <h3 className="as-results-heading">Results ({filteredApplicants.length})</h3>

      {/* Applicants Cards */}
      <div className="as-cards-container">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((applicant, index) => (
            <div key={applicant.applicantID || index} className="as-card">
              <div className="as-profile">
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
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.5rem'
                    }}
                  >
                    {applicant.firstName ? applicant.firstName.charAt(0).toUpperCase() : ''}
                  </div>
                )}
                <div className="as-profile-info">
                  <h4>{`${applicant.firstName} ${applicant.lastName}`}</h4>
                  <p>{applicant.primaryRole || 'Role not specified'}</p>
                  <p>Experience: {applicant.experience ? `${applicant.experience} yrs` : 'Not specified'}</p>
                </div>
              </div>
              <div className="as-company-info">
                {applicant.company && applicant.company.toLowerCase() !== 'unemployed' ? (
                  <p>{applicant.company}</p>
                ) : (
                  <p>Currently <strong>Unemployed</strong></p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results-message">
            <p>No applicants match your search criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantSearchForm;