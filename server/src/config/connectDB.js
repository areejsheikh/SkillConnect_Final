//This is a config file for database connection 

import dotenv from 'dotenv';
import { Sequelize } from 'sequelize'; // Import Sequelize library


dotenv.config();
//Configure Database with Sequlize library
const mySequelize = new Sequelize(
    process.env.DB_NAME,   // Database name
    process.env.DB_USER,   // Username
    process.env.DB_PASSWORD, // Password
    {
      host: process.env.DB_HOST,  // Host (localhost)
      dialect: 'mysql',           
      port: process.env.DB_PORT,  
    }
  );


async function checkDBconnect() {
    try {
      await mySequelize.authenticate();  
      return true;
    } 
    catch (err) {
      throw err;
    }
  }

  
export {
    mySequelize,
    checkDBconnect
}; 


