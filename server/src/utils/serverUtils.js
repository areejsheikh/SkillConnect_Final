import dotenv from 'dotenv';
import { checkDBconnect } from '../config/connectDB.js'; // Import the checkDBconnect function
import {syncDatabase} from '../config/syncDB.js'; // Import the syncDatabase function



dotenv.config();

async function startServer(app, Port) {
    try {
      const isDBConnected = await checkDBconnect();
      
      if (isDBConnected) {
        console.log(`Connection with Database: ${process.env.DB_NAME} is SUCCESSFUL`);
        
        const isDBSynced = await syncDatabase();
        if(!isDBSynced) {
            console.log('Unable to connect to the database');
            process.exit(1); 
          }
        console.log("DB Synced");
        app.listen(Port, () => { //start server
          console.log(`Server is running on Port: ${Port}`);
        });
  
      } 
      else {
        console.error('Unable to connect to the database');
        process.exit(1);  // Exit the process if DB connection fails
      }
  
    } 
    catch (err) {
      console.error('Error:', err.message);
      process.exit(1); // Exit if error
    }
  }
  
export {startServer};