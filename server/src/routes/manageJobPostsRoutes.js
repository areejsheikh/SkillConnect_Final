import express from 'express';
import { createJobPosting, getRecruiterJobPosts} from '../controllers/jobPostingsController.js';
import { getApplicantsForJob} from '../controllers/applicationsController.js';

const router = express.Router();


router.get('/getJobPosts/:recruiterID',getRecruiterJobPosts);
router.get('/applicants/:jobID', getApplicantsForJob);
//router.get('/applicantInfo/:applicantID', );
router.post('/postJob/:recruiterID',createJobPosting);


//router.get('/getUserID/:userID', getBuyerDetails);


export default router;
