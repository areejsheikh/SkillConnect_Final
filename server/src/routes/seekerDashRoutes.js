import express from 'express';
import { getUserApplications } from '../controllers/applicationsController.js';
import { getSavedJobs } from '../controllers/savedJobsController.js';
import { getCompleteSeekerDash } from '../controllers/seekerDashController.js';
import { getSeekerCompleteProfile } from '../controllers/seekerProfileController.js';

const router = express.Router();

router.get('/getDash/:userID',getCompleteSeekerDash);
router.get('/getAllAppliedJobs/:userID', getUserApplications );
router.get('/getSavedJobs/:userID', getSavedJobs );
router.get('/getProfile/:userID', getSeekerCompleteProfile );
//router.post('/', );

//router.get('/getUserID/:userID', getBuyerDetails);


export default router;
