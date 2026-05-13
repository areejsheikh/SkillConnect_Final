import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import User from './usersModel.js';

const SeekerProfile = mySequelize.define("SeekerProfile", {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: User,
      key: 'userID',   // ✅ matches User PK
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false 
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false 
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  profilePicTitle: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'defaultPerson.png',
  },
}, {
  tableName: 'seekerProfile',
  timestamps: false,
});

// ✅ Direct association with User
SeekerProfile.belongsTo(User, {
  foreignKey: 'userID',
  targetKey: 'userID',   // ✅ must match User PK
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Utility methods
SeekerProfile.getBasicSeekerProfile = async (userID) => {
  try {
    return await SeekerProfile.findOne({ where: { userID } });
  } catch (error) {
    throw new Error("Error fetching seeker profile: " + error.message);
  }
};

SeekerProfile.getBasicDataOfApplicants = async (userIDs) => {
  try {
    return await SeekerProfile.findAll({ where: { userID: userIDs } });
  } catch (error) {
    throw new Error("Error fetching applicants profiles: " + error.message);
  }
};

SeekerProfile.addBasicSeekerProfile = async (data) => {
  try {
    return await SeekerProfile.create(data);
  } catch (error) {
    throw new Error("Error adding new seeker profile: " + error.message);
  }
};

SeekerProfile.updateBasicSeekerProfile = async (userID, updatedData) => {
  try {
    const [updatedCount] = await SeekerProfile.update(updatedData, { where: { userID } });
    if (updatedCount === 0) throw new Error("Profile not found or no changes made");
    return updatedCount;
  } catch (error) {
    throw new Error("Error updating seeker profile: " + error.message);
  }
};

export default SeekerProfile;
