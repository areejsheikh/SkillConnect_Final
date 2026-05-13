import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import users from './usersModel.js';
import jobPostings from './jobPostingsModel.js';

const SavedJobs = mySequelize.define("savedJobs", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users, 
      key: 'userID',
    },
    onDelete: 'CASCADE',
  },
  jobID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: jobPostings,
      key: 'jobPostID',
    },
    onDelete: 'CASCADE',
  },
  saved_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'savedJobs',
  timestamps: false,
});

// Association setup
SavedJobs.associate = (models) => {
  SavedJobs.belongsTo(models.users, {
    foreignKey: 'userID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });

  SavedJobs.belongsTo(models.jobPostings, {
    foreignKey: 'jobID',
    targetKey: 'jobPostID',
    onDelete: 'CASCADE',
  });
};

SavedJobs.getSavedJobs = async (userID) => {
  try {
    // Step 1: Get all jobPostIDs saved by the user
    const savedJobEntries = await SavedJobs.findAll({
      where: { userID },
      attributes: ['jobID'],
    });

    const savedJobsIDsofUser = savedJobEntries.map(entry => entry.jobID);

    // Step 2: Fetch full job details from jobPostings
    const savedJobsWithDetails = await jobPostings.findAll({
      where: {
        jobPostID: savedJobsIDsofUser, //IN clause used here
      },
      attributes: ['jobPostID', 'title', 'company', 'jobLocation', 'salaryRange', 'jobSetup', 'status'], // or just leave it to get all
    });

    return savedJobsWithDetails;
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    throw error;
  }
};


SavedJobs.getSavedJobsCount = async (userID) => {
  try {
    const count = await SavedJobs.count({ where: { userID } });
    return count;
  } catch (error) {
    console.error("Error getting saved jobs count:", error);
    throw error;
  }
}

SavedJobs.saveJob = async (userID, jobPostID) => {
  try {
    const newSavedJob = await SavedJobs.create({ userID, jobPostID });
    return newSavedJob;
  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
}

SavedJobs.removeSavedJob = async (userID, jobPostID) => {
  try {
    const deletedCount = await SavedJobs.destroy({
      where: { userID, jobPostID },
    });
    if (deletedCount === 0) {
      throw new Error("Saved job not found or already removed");
    }
    return deletedCount;
  } catch (error) {
    console.error("Error removing saved job:", error);
    throw error;
  }
}

export default SavedJobs;
