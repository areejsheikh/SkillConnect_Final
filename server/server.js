//This is the server file which is entry point for all server related tasks
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { startServer } from './src/utils/serverUtils.js'; // Import the startServer function
import { logReqs } from './src/middlewares/logEvents.js';

import userRoutes from './src/routes/usersRoutes.js'; // Import the user routes
import jobRoutes from './src/routes/jobRoutes.js'; // Import the job routes
import seekerDashRoutes from './src/routes/seekerDashRoutes.js'; // Import the job routes
import manageJobsRoutes from './src/routes/manageJobPostsRoutes.js'; // Import the job routes
import processApplicants from './src/routes/processApplicantsRoutes.js'; // Import the job routes
import recruiterDashRoutes from './src/routes/recruiterDashRoutes.js'; // Import the job routes

const app = express();
const Port = process.env.PORT || 5000;

//server
app.use(logReqs);            //custom middleware for debug purposes
app.use(bodyParser.json());  //built-in middleware
app.use(cors());



app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/seekerdash', seekerDashRoutes);
app.use('/manageJobs', manageJobsRoutes);
app.use('/processApplicants',processApplicants );
app.use('/job-analytics',recruiterDashRoutes);



startServer(app, Port);
