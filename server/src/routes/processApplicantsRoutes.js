import express from 'express';
import { scheduleInterview } from '../controllers/interviewController.js';
import { updateApplicationStatus} from '../controllers/applicationsController.js';
import { getAllJobSeekers } from '../controllers/usersController.js';

const router = express.Router();

router.get('/potentialApplicants', getAllJobSeekers); // Fetch all potential applicants for a searching page
router.post('/interview/:applicantID', scheduleInterview);
router.post('/reject/:applicantID', updateApplicationStatus );

export default router;