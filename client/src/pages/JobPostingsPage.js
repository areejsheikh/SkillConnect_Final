import React from 'react';
import { useParams } from 'react-router-dom';
import NavbarWithIcons from '../components/NavbarWithIcons';
import JobPostings from '../components/JobPostings';
import Footer from '../components/Footer';
import BreadcrumbNavbar from '../components/BreadcrumNavbar';

const JobPostingsPage = () => {
  const { userId } = useParams(); // Retrieve userId from URL
  console.log('User ID in JobPostingsPage:', userId); // Debugging log

  const breadcrumbs = [
    { label: 'Home', link: `/dashboard/${userId}` },
    { label: 'Job Postings', link: `/job-postings/${userId}` },
  ];

  return (
    <div>
      <NavbarWithIcons />
      <BreadcrumbNavbar currentPage="Job Postings" breadcrumbs={breadcrumbs} />
      <JobPostings /> {/* JobPostings component automatically fetches jobs */}
      <Footer />
    </div>
  );
};

export default JobPostingsPage;