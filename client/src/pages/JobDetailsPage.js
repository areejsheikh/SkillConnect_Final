import React, { useState } from 'react';
import NavbarWithIcons from '../components/NavbarWithIcons';
import JobDetails from '../components/JobDetails';
import JobRightSidebar from '../components/JobRightSidebar';
import Footer from '../components/Footer';
import BreadcrumbNavbar from '../components/BreadcrumNavbar';
import { useParams } from 'react-router-dom'; // Import useParams

const JobDetailsPage = () => {
  const { jobPostID, userId } = useParams(); // Retrieve jobPostID and userId from the URL
  const [recruiterID, setRecruiterID] = useState(null); // State to store recruiterID

  const breadcrumbs = [
    { label: 'Home', link: `/dashboard/${userId}` },
    { label: 'Job Postings', link: `/job-postings/${userId}` },
    { label: 'Job Details', link: `/job-details/${jobPostID}/${userId}` },
  ];

  return (
    <div>
      <NavbarWithIcons />
      <BreadcrumbNavbar currentPage="Job Details" breadcrumbs={breadcrumbs} />
      <div style={{ marginBottom: '2rem' }}></div>

      <div style={{ display: 'flex', gap: '2rem', padding: '2rem', backgroundColor: 'white' }}>
        <div style={{ flex: 2 }}>
          <JobDetails jobPostID={jobPostID} setRecruiterID={setRecruiterID} /> {/* Pass setRecruiterID */}
        </div>
        <div style={{ flex: 1 }}>
          <JobRightSidebar recruiterID={recruiterID} jobPostID={jobPostID} userId={userId} /> {/* Pass recruiterID */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailsPage;