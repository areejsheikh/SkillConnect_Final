import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import users from './usersModel.js'; // Make sure the path is correct

const JobPostings = mySequelize.define("jobPostings", {
  jobPostID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  //userID here is recruiterID
  userID: {
    type: DataTypes.INTEGER,
    references: {
      model: users,
      key: 'userID',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  title: DataTypes.STRING(100),
  company: DataTypes.STRING(25),
  jobDescrip: DataTypes.TEXT,
  jobReqs: DataTypes.TEXT,
  jobDesirables: DataTypes.TEXT,
  jobBenefits: DataTypes.TEXT,
  jobLocation: DataTypes.STRING(100),
  salaryRange: DataTypes.STRING(50),
  jobSetup: {
    type: DataTypes.ENUM('remote', 'on-site', 'hybrid', 'freelance'),
  },
  eduReq: DataTypes.STRING(50),
  jobLevel: DataTypes.STRING(50),
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  
}, {
  tableName: 'jobPostings',
  timestamps: false,
});

// Define the association
JobPostings.associate = (models) => {
  JobPostings.belongsTo(models.users, {
    foreignKey: 'userID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });
};

JobPostings.createJobPost = async (jobPost) => {
  try {
    const newJobPost = await JobPostings.create(jobPost);
    return newJobPost;
  } catch (error) {
    console.error("Error creating job post:", error);
    throw error;
  }
}

JobPostings.getAllOpenJobs = async () => {
  try {
    const openJobs = await JobPostings.findAll({
      where: { status: 'open' },
      attributes: ['jobPostID', 'title', 'company', 'jobLocation', 'salaryRange', 'jobSetup'],
    });
    return openJobs;
  } catch (error) {
    console.error("Error fetching open jobs:", error);
    throw error;
  }
}

JobPostings.getJobById = async (jobPostID) => {
  try {
    const job = await JobPostings.findOne({ where: { jobPostID } });
    return job;
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    throw error;
  }
}

JobPostings.getRecruiterJobPosts = async (userID) => {
  try {
    const jobPosts = await JobPostings.findAll({
      where: { userID },
      attributes: ['jobPostID', 'title', 'company', 'jobLocation', 'jobDescrip']
    });
    return jobPosts;
  } catch (error) {
    console.error("Error fetching recruiter job posts:", error);
    throw error;
  }
}

JobPostings.closeJobPosting = async (jobID) => {
  try {
    const [updatedCount] = await JobPostings.update({ status: 'closed' }, { where: { jobPostID: jobID } });
    if (updatedCount === 0) {
      throw new Error("Job posting not found or already closed");
    }
    return updatedCount;
  } catch (error) {
    console.error("Error closing job posting:", error);
    throw error;
  }
}

export default JobPostings;
