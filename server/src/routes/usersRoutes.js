import express from 'express';
import { createUser, loginUser, updateUserPassword } from '../controllers/usersController.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.put('/updatePassword/:userID',updateUserPassword);




export default router;
