import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import User from './usersModel.js';

const SeekerWorkingStatus = mySequelize.define("SeekerWorkingStatus", {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    references: {
      model: User,
      key: 'userID',   // ✅ matches User PK
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  primaryRole: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  workSetup: {
    type: DataTypes.ENUM('remote', 'on-site', 'hybrid', 'freelance'),
    defaultValue: 'on-site',
  },
}, {
  tableName: 'seekerWorkingStatus',
  timestamps: false,
});

// ✅ Direct association with User
SeekerWorkingStatus.belongsTo(User, {
  foreignKey: 'userID',
  targetKey: 'userID',   // ✅ must match User PK
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Utility methods
SeekerWorkingStatus.getSeekerWorkingStatus = async (userID) => {
  return await SeekerWorkingStatus.findOne({
    where: { userID },
    attributes: ['primaryRole', 'company', 'experience', 'workSetup'],
  });
};

SeekerWorkingStatus.getWorkingStatusOfApplicants = async (userIDs) => {
  return await SeekerWorkingStatus.findAll({
    where: { userID: userIDs }, // Sequelize handles IN clause
    attributes: ['userID', 'primaryRole', 'company', 'experience', 'workSetup'],
  });
};

SeekerWorkingStatus.addSeekerWorkingStatus = async (userID) => {
  return await SeekerWorkingStatus.create({
    userID,
    primaryRole: null,
    company: null,
    experience: null,
    workSetup: null,
  });
};

SeekerWorkingStatus.updatePrimaryRole = async (userID, primaryRole) => {
  const [updatedCount] = await SeekerWorkingStatus.update({ primaryRole }, { where: { userID } });
  if (updatedCount === 0) throw new Error("Working status not found or no changes made");
  return updatedCount;
};

SeekerWorkingStatus.updateCompany = async (userID, company) => {
  const [updatedCount] = await SeekerWorkingStatus.update({ company }, { where: { userID } });
  if (updatedCount === 0) throw new Error("Working status not found or no changes made");
  return updatedCount;
};

SeekerWorkingStatus.updateWorkSetup = async (userID, workSetup) => {
  const [updatedCount] = await SeekerWorkingStatus.update({ workSetup }, { where: { userID } });
  if (updatedCount === 0) throw new Error("Working status not found or no changes made");
  return updatedCount;
};

SeekerWorkingStatus.updateExperience = async (userID, experience) => {
  const [updatedCount] = await SeekerWorkingStatus.update({ experience }, { where: { userID } });
  if (updatedCount === 0) throw new Error("Working status not found or no changes made");
  return updatedCount;
};

export default SeekerWorkingStatus;
