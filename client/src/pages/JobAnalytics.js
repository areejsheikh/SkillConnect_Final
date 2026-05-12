import React from 'react';
import JobAnalyticsForm from '../components/JobAnalyticsForm';
import '../components/styles/JobAnalytics.css';
import JobNavbar from '../components/JobNavbar';

const JobAnalytics = () => {
  return (
    <div className="ja-page">
      <JobNavbar />
      <JobAnalyticsForm />
    </div>
  );
};

export default JobAnalytics;
