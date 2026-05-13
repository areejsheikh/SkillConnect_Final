import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import users from './usersModel.js'; 
 
const recruiterProfile = mySequelize.define("recruiterProfile", {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: users, // Name of the target table
      key: 'userID',  // Column being referenced in the target table
    },
    onDelete: 'CASCADE',
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  contactNum: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true,
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
  tableName: 'recruiterProfile',
  timestamps: false,
});

// Association
recruiterProfile.associate = (models) => {
  recruiterProfile.belongsTo(models.users, {
    foreignKey: 'userID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });
};

//auto called when registered a recuiter
recruiterProfile.addBasicRecruiterProfile = async (Data) => {
  try {
    const newProfile = await recruiterProfile.create(Data);
    return newProfile;
  } catch (error) {
    console.error("Error adding recruiter profile:", error);
    throw error;
  }
}

recruiterProfile.getRecruiterProfileData = async (userID) => {
  try {
    const profile = await recruiterProfile.findOne({
      where: { userID },
    });
    return profile;
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    throw error;
  }
}

//savechanges button on recruiterProfilePage pressed, check state of all fields,
//and bundle the changed ones into an object and send it to the backend
recruiterProfile.updateRecruiterProfile = async (userID, updatedData) => {
  try {
    const [updatedCount] = await recruiterProfile.update(updatedData, {
      where: { userID },
    });
    if (updatedCount === 0) {
      throw new Error("Profile not found or no changes made");
    }
    return updatedCount;
  } catch (error) {
    console.error("Error updating recruiter profile:", error);
    throw error;
  }
}

export default recruiterProfile;
