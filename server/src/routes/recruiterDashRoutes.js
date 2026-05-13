import express from 'express';
import { getJobPostViews, getScheduledInterviews,getJobResponseRate,incrementJobViews,incrementJobApplications} 
from '../controllers/analyticsController.js';



const router = express.Router();

router.get('/jobPostsViews/:recruiterID',getJobPostViews );
router.get('/scheduledInterviews/:recruiterID', getScheduledInterviews );
router.get('/responseRates/:recruiterID',getJobResponseRate);
router.get('/incrementView/:jobID', incrementJobViews);
router.get('/incrementApplications/:jobID', incrementJobApplications);


export default router;