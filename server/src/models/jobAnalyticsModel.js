import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import users from './usersModel.js'; 
import jobPostings from './jobPostingsModel.js';
import Interviews from './interviewsModel.js'; // Assuming you have an Interviews model

const JobAnalytics = mySequelize.define("jobAnalytics", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    references: {
      model: users,
      key: 'userID',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  jobID: {
    type: DataTypes.INTEGER,
    references: {
      model: jobPostings,
      key: 'jobPostID',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  applications: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'jobAnalytics',
  timestamps: false,
});

// Define associations like before
JobAnalytics.associate = (models) => {
  JobAnalytics.belongsTo(models.users, {
    foreignKey: 'userID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });

  JobAnalytics.belongsTo(models.jobPostings, {
    foreignKey: 'jobID',
    targetKey: 'jobPostID',
    onDelete: 'CASCADE',
  });
};

JobAnalytics.getJobViewsByRecruiterID = async (recruiterID) => {
  try {
    const jobViews = await JobAnalytics.findAll({
      where: { userID: recruiterID },
      attributes: ['jobID', 'views'],
    });
    return jobViews;
  } catch (error) {
    console.error("Error fetching job views by recruiter ID:", error);
    throw error;
  }
}
JobAnalytics.getJobApplicationsByRecruiterID =async (recruiterID) => {
  try {
    const jobApplications = await JobAnalytics.findAll({
      where: { userID: recruiterID },
      attributes: ['jobID', 'applications'],
    });
    return jobApplications;
  } catch (error) {
    console.error("Error fetching job applications by recruiter ID:", error);
    throw error;
  }
}

JobAnalytics.getScheduledInterviewsOfRecruiter = async (appliedIDs) => {
  try { 
    const scheduledInterviews = await Interviews.count({
      where: { appliedID: appliedIDs }, //IN clause for multiple 
    }); 
    return scheduledInterviews;
  } catch (error) { 
    console.error("Error fetching scheduled interviews by recruiter ID:", error);
    throw error;
  }
}

JobAnalytics.getJobAnalytics = async (jobID) => {
  try {
    const jobAnalytics = await JobAnalytics.findOne({
      where: { jobID },
      attributes: ['views', 'applications', 'last_updated'],
    });
    return jobAnalytics;
  } catch (error) {
    console.error("Error fetching job analytics:", error);
    throw error;
  }
}

JobAnalytics.incrementJobViews = async (jobID) => {
  try {
    await JobAnalytics.increment('views', { by: 1, where: { jobID } });
    await JobAnalytics.update({ last_updated: new Date() }, { where: { jobID } });
  } catch (error) {
    console.error("Error incrementing job views:", error);
    throw error;
  }
}

JobAnalytics.incrementJobApplications = async (jobID) => {
  try {
    await JobAnalytics.increment('applications', { by: 1, where: { jobID } });
    await JobAnalytics.update({ last_updated: new Date() }, { where: { jobID } });
  } catch (error) {
    console.error("Error incrementing job applications:", error);
    throw error;
  }
}


export default JobAnalytics;
