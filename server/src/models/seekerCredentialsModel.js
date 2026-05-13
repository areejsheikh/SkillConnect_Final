import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';
import users from './usersModel.js';

const SeekerCredentials = mySequelize.define("seekerCredentials", {
  credID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userID: {
    type: DataTypes.INTEGER,
    references: {
      model: users,
      key: 'userID',
    },
    onDelete: 'CASCADE'
  },
  credential: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'seekerCredentials',
  timestamps: false,
});

SeekerCredentials.associate = (models) => {
  SeekerCredentials.belongsTo(models.users, {
    foreignKey: 'userID',
    targetKey: 'userID',
    onDelete: 'CASCADE',
  });
};

SeekerCredentials.geSeekerCredentials = async (userID) => {
  try {
    const credentials = await SeekerCredentials.findAll({
      where: { userID },
      attributes: ['credID', 'credential'],
    });
    return credentials;
  } catch (error) {
    console.error("Error fetching user credentials:", error);
    throw error;
  }
}

SeekerCredentials.getSeekerCredentialsOfApplicants = async (userIDs) => {
  try {
    const applicantsCredentials = await SeekerCredentials.findAll({
      where: { userID : userIDs },
      attributes: ['userID', 'credential'],
    });
    return applicantsCredentials;
  } catch (error) {
    console.error("Error fetching applicants credentials:", error);
    throw error;
  }
}

SeekerCredentials.addCredential = async (userID, credential) => {
  try {
    const newCredential = await SeekerCredentials.create({ userID, credential });
    return newCredential;
  } catch (error) {
    console.error("Error adding credential:", error);
    throw error;
  }
}

SeekerCredentials.deleteCredential = async (credID) => {
  try {
    const deletedCount = await SeekerCredentials.destroy({
      where: { credID },
    });
    if (deletedCount === 0) {
      throw new Error("Credential not found or already deleted");
    }
    return deletedCount;
  } catch (error) {
    console.error("Error deleting credential:", error);
    throw error;
  }
}

export default SeekerCredentials;
