import express from 'express';
import { saveJob } from '../controllers/savedJobsController.js';
import { getAllOpenJobs, getJobById } from '../controllers/jobPostingsController.js';
import { applyToJob} from '../controllers/applicationsController.js';

const router = express.Router();


router.get('/getAllJobs',getAllOpenJobs );
router.get('/getJob/:jobPostID', getJobById );

router.post('/save/:jobPostID', saveJob);
router.post('/apply/:jobPostID', applyToJob);


//router.get('/getUserID/:userID', getBuyerDetails);


export default router;
