import { DataTypes } from 'sequelize';
import { mySequelize } from '../config/connectDB.js';

const User = mySequelize.define("User", {
  userID: {   // ✅ renamed from id
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("jobseeker", "recruiter"),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Utility methods
User.createUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    throw new Error('[ERROR CREATING USER] ' + error.message);
  }
};

User.findUserByEmail = async (email) => {
  try {
    return await User.findOne({ where: { email } });
  } catch (error) {
    throw new Error('ERROR FINDING USER BY EMAIL: ' + error.message);
  }
};

User.updatePassword = async (userID, newPassword) => {
  try {
    const [affectedRows] = await User.update(
      { password: newPassword },
      { where: { userID } }
    );
    return affectedRows;
  } catch (error) {
    throw new Error('ERROR UPDATING PASSWORD: ' + error.message);
  }
};

User.getUserByID = async (userID) => {
  try {
    return await User.findByPk(userID);
  } catch (error) {
    throw new Error('ERROR FINDING USER BY ID: ' + error.message);
  }
};

User.getUsernameByID = async (userID) => {
  try {
    const user = await User.findByPk(userID, { attributes: ['username'] });
    return user ? user.username : null;
  } catch (error) {
    throw new Error('ERROR FETCHING USERNAME BY ID: ' + error.message);
  }
};

User.findUsersByRole = async (role) => {
  try {
    return await User.findAll({
      where: { role },
      attributes: ['userID', 'role'],
    });
  } catch (error) {
    throw new Error('ERROR FINDING USERS BY ROLE: ' + error.message);
  }
};

export default User;
