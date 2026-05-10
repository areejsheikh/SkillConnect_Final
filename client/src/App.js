import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import JobPostingsPage from './pages/JobPostingsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import ProfileDashboard from './pages/ProfileDashboard';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import ManageJobPostings from './pages/ManageJobPostings';
import PostJobPopup from './pages/PostJobPopup';
import ApplicantTracking from './pages/ApplicantTracking';
import InterviewScheduling from './pages/InterviewScheduling';
import ApplicantSearch from './pages/ApplicantSearch';
import JobAnalytics from './pages/JobAnalytics';
import AppliedJobsPage from './pages/AppliedJobspage';
import SavedJobsPage from './pages/SavedJobspage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ProviderProfileManage from './pages/ProviderProfileManage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard/:userId" element={<DashboardPage />} />
          <Route path="/job-postings/:userId" element={<JobPostingsPage />} />
          <Route path="/job-details/:jobPostID/:userId" element={<JobDetailsPage />} />
          <Route path="/profile-dashboard/:userId" element={<ProfileDashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/manage-job-postings/:recruiterId" element={<ManageJobPostings />} />
          <Route path="/post-job-popup/:recruiterId" element={<PostJobPopup />} />
          <Route path="/applicant-tracking/:jobPostID/:recruiterId" element={<ApplicantTracking />} />
          <Route path="/interview-scheduling/:recruiterId/:jobPostID" element={<InterviewScheduling />} />
          <Route path="/applicant-search/:recruiterId" element={<ApplicantSearch />} />
          <Route path="/applied-jobs-page/:userId" element={<AppliedJobsPage />} />
          <Route path="/job-analytics/:recruiterId" element={<JobAnalytics />} />
          <Route path="/provider-profile-manage/:recruiterId" element={<ProviderProfileManage />} />
          <Route path="/profile-settings/:userId" element={<ProfileSettingsPage />} />
          <Route path="/saved-jobs/:userId" element={<SavedJobsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;