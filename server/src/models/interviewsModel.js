import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import appliedJobs from './appliedJobsModel.js'; // Make sure this path is correct

const Interviews = mySequelize.define("interviews", {
  interviewID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  appliedID: {
    type: DataTypes.INTEGER,
    references: {
      model: appliedJobs,
      key: 'appliedID',
    },
    onDelete: 'CASCADE',
    allowNull: false,
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('in_person', 'online'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
  },
  notes: DataTypes.TEXT,
}, {
  tableName: 'interviews',
  timestamps: false,
});

// Define the association like in your original picture
Interviews.associate = (models) => {
  Interviews.belongsTo(models.appliedJobs, {
    foreignKey: 'appliedID',
    targetKey: 'appliedID',
    onDelete: 'CASCADE',
  });
};


Interviews.scheduleInterview = async (interviewData) => {
  try {
    const newInterview = await Interviews.create(interviewData);
    return newInterview;
  } catch (error) {
    console.error("Error scheduling interview:", error);
    throw error;
  }
}

Interviews.updateInterview = async (interviewID, updates) => {
  try {
    const [updatedCount] = await Interviews.update(updates, { where: { interviewID } });
    if (updatedCount === 0) {
      throw new Error("Interview not found or no changes made");
    }
    return updatedCount;
  } catch (error) {
    console.error("Error updating interview:", error);
    throw error;
  }
}

Interviews.cancelInterview = async (interviewID) => {
  try {
    const [updatedCount] = await Interviews.update(
      { status: 'cancelled' },
      { where: { interviewID } }
    );
    if (updatedCount === 0) {
      throw new Error("Interview not found or already cancelled");
    }
    return updatedCount;
  } catch (error) {
    console.error("Error cancelling interview:", error);
    throw error;
  }
}

export default Interviews;
