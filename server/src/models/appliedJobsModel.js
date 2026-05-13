import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import users from './usersModel.js'; 
import jobPostings from './jobPostingsModel.js';

const appliedJobs = mySequelize.define("appliedJobs", {
  appliedID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  //jobSeekerID
  applicantID: {
    type: DataTypes.INTEGER,
    references: {
      model: users,
      key: 'userID',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  recruiterID: {
    type: DataTypes.INTEGER,
    references: {
      model: users,
      key: 'userID',
    },
    onDelete: 'CASCADE'
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
  applicationStatus: {
    type: DataTypes.ENUM('Active', 'Expired', 'Rejected', 'Interview Scheduled'),
    defaultValue: 'Active',
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'appliedJobs',
  timestamps: false,
});

// Define associations
appliedJobs.associate = (models) => {
  appliedJobs.belongsTo(models.users, {
    foreignKey: 'applicantID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });

  appliedJobs.belongsTo(models.users, {
    foreignKey: 'recruiterID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });

  appliedJobs.belongsTo(models.jobPostings, {
    foreignKey: 'jobID',
    targetKey: 'jobPostID',
    onDelete: 'CASCADE',
  });
};

appliedJobs.getAppliedJobsOfUser = async (applicantID) => {
  try {
    const appliedJobsList = await appliedJobs.findAll({
      where: { applicantID },
      attributes: ['applicationStatus'],
      include: [
        {
          model: jobPostings,
          attributes: ['jobPostID', 'title', 'company', 'jobLocation', 'salaryRange','jobSetup'],
        },
      ],
    });
    return appliedJobsList;
  } catch (error) {
    console.error("Error fetching applied jobs of user:", error);
    throw error;
  }
}

appliedJobs.getActiveAppliedJobsOfUser = async (applicantID) => {
  try {
    const activeJobsList = await appliedJobs.findAll({
      where: { applicantID, applicationStatus: 'Active' },
      attributes: ['applicationStatus'],
      include: [
        {
          model: jobPostings,
          attributes: ['jobPostID', 'title', 'company', 'jobLocation', 'salaryRange','jobSetup']
        },
      ],
    });
    return activeJobsList;
  } catch (error) {
    console.error("Error fetching active applied jobs of user:", error);
    throw error;
  }
}

appliedJobs.getAppliedJobsCount = async (applicantID) => {
  try {
    const count = await appliedJobs.count({ where: { applicantID } });
    return count;
  } catch (error) {
    console.error("Error getting applied jobs count:", error);
    throw error;
  }
}

appliedJobs.checkIfAlreadyApplied = async (applicantID, jobPostID) => {
  try {
    const application = await appliedJobs.findOne({
      where: { applicantID, jobID: jobPostID },
    });
    return !!application; // Returns true if application exists, false otherwise
  } catch (error) {
    console.error("Error checking if already applied:", error);
    throw error;
  }
}

appliedJobs.getApplicantsCountForRecruiterPost = async (jobPostID) => {
  try {
    const count = await appliedJobs.count({
      where: {jobID: jobPostID}
    });
    return count;
  } catch (error) {
    console.error("Error fetching applicants count for recruiter post:", error);
    throw error;
  }
}

appliedJobs.getApplicantsForRecruiterPost = async (jobID) => {
  try {
    const applicants = await appliedJobs.findAll({
      where: { jobID },
      attributes: ['applicantID', 'applicationStatus'],
    });
    return applicants;
  } catch (error) {
    console.error("Error fetching applicants for recruiter post:", error);
    throw error;
  }
}

appliedJobs.updateApplicationStatus = async (applicantID, jobID, status) => {
  try {
    const updatedApplication = await appliedJobs.update(
      { applicationStatus: status },
      { where: { applicantID, jobID } }
    );
    return updatedApplication;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
}

appliedJobs.getApplicationIDforUser = async (applicantID, jobID) => {
  try {
    const application = await appliedJobs.findOne({
      where: { applicantID, jobID },
      attributes: ['appliedID'],
    });
    return application ? application.appliedID : null; // Return the appliedID or null if not found
  } catch (error) {
    console.error("Error fetching application ID for user:", error);
    throw error;
  }
}
export default appliedJobs;
