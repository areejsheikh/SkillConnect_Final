import { mySequelize } from '../config/connectDB.js'; 
import users from './usersModel.js';
import seekerWorkingStatus from './seekerWorkingStatusModel.js';
import seekerProfile from './seekerProfileModel.js';
import SeekerCredentials from './seekerCredentialsModel.js'; 
import savedJobs from './savedJobsModel.js'; 
import recruiterProfile from './recruiterProfileModel.js';
import jobPostings from './jobPostingsModel.js'; 
import jobAnalytics from './jobAnalyticsModel.js'; 
import Interviews from './interviewsModel.js'; 
import appliedJobs from './appliedJobsModel.js'; 


const models = {
  users,
  seekerWorkingStatus,
  seekerProfile,
  SeekerCredentials,
  savedJobs,
  recruiterProfile,
  jobPostings,
  jobAnalytics,
  Interviews, 
  appliedJobs
};

// Call each model's associate function to set up relationships
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models); // Pass in all models so each one can find what it's related to
  }
});

export { models, mySequelize}
