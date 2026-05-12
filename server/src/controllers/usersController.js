import users from '../models/usersModel.js';
import SeekerProfile from '../models/seekerProfileModel.js';
import recruiterProfile from '../models/recruiterProfileModel.js';
import SeekerCredentials from '../models/seekerCredentialsModel.js';
import SeekerWorkingStatus from '../models/seekerWorkingStatusModel.js';
import { body, validationResult } from 'express-validator';

import {formatSeekerProfileObj} from '../utils/formatObjects.js';


async function createUser(req, res) {
    try {
        //console.log('Creating user with data:', req.body); // Debugging line
        // Trim and normalize inputs first
        req.body.email = req.body.email.trim().toLowerCase();
        req.body.role = req.body.role?.trim().toLowerCase();

        // Validate input data
        await body('name').notEmpty().withMessage('Username is required').run(req);
        await body('email').isEmail().withMessage('Please provide a valid email').run(req);
        await body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);
        await body('role')
            .isIn(['jobseeker', 'recruiter'])
            .withMessage('User role must be either jobseeker or recruiter')
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array()); // Debugging line
            return res.status(400).json({ message: errors.array() });
        }

        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await users.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create the user
        const user = await users.createUser({
            username: name,
            email,
            password,
            role
        });

        if (!user) {
            return res.status(500).json({ message: 'Error creating user' });
        }
        
        await createDefaultUserProfile(role, name, user.userID, email);

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// {
//     "title": "Technical Support Specialist",
//     "type": "PART-TIME",
//     "salary": "$20,000 - $25,000",
//     "company": "Google Inc.",
//     "location": "Dhaka, Bangladesh"
// }


async function loginUser(req, res) {
    try {
        // Trim and normalize inputs first
        req.body.email = req.body.email.trim().toLowerCase();
        req.body.role = req.body.role?.trim().toLowerCase();
        // if(req.body.role == 'candidate') {
        //     req.body.role = 'jobseeker'; // Default role if not provided
        // }

        // Validate input data
        await body('email').isEmail().withMessage('Please provide a valid email').run(req);
        await body('password').notEmpty().withMessage('Password is required').run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, role } = req.body;

        // Find user by email
        const user = await users.findUserByEmail(email);
        if (!user) {
            console.error('User not found:', email); // Debugging line
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password (plaintext check for simplicity)
        if (user.password !== password) {
            console
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Check if role matches the userType in DB
        if (role !== user.role) {
            console.error('Role mismatch:', { expected: user.role, provided: role }); // Debugging line
            return res.status(401).json({ message: 'Invalid role for this user' });
        }
            //console.log('User logged in:', user); // Debugging line
        // Successful login
        res.status(200).json({
            message: 'Login successful',
            user: {
                userID: user.userID,
                name: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function updateUserPassword(req, res) {
    try {
        const { userID } = req.params;
        const { currentPassword, newPassword } = req.body;

        // Validate input data
        await body('currentPassword')
            .isLength({ min: 6 })
            .withMessage('Current Password must be at least 6 characters long')
            .run(req);
         // Validate input data
        await body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New Password must be at least 6 characters long')
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if(currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as current password' });
        }
        // Find the user by userID
        const user = await users.findByPk(userID);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(user.password !== currentPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }   

        // Update the user's password
        const updatedUser = await users.updatePassword(userID, newPassword);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Password update failed' });
        }

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function createDefaultUserProfile(role, name, userID, email) {
    if (role === 'jobseeker') {
        const nameParts = name.split(' ');
        const fName = nameParts[0];
        const lName = nameParts[1];

        const defaultProfile = await SeekerProfile.addBasicSeekerProfile(
            formatSeekerProfileObj(userID, fName, lName, email)
        );

        if (!defaultProfile) {
            console.error('Error creating default profile for jobseeker:', userID);
        }
    }
    //recuriter
    else {
        const nameParts = name.split(' ');
        const fName = nameParts[0];
        const lName = nameParts[1];

        const defaultProfile = await recruiterProfile.addBasicRecruiterProfile(
            formatSeekerProfileObj(userID, fName, lName, email)
        );

        if (!defaultProfile) {
            console.error('Error creating default profile for recruiter:', userID);
        }
    }
}


async function getAllJobSeekers(req, res) {
    try {
        const jobSeekers = await users.findUsersByRole('jobseeker');
        if (!jobSeekers || jobSeekers.length === 0) {
            return res.status(404).json({ message: 'No jobseekers/applicants found' });
        }
        
        const allSeekerProfiles = await Promise.all(
            jobSeekers.map(async (jobSeeker) => {
            const seekerProfile = await SeekerProfile.getBasicSeekerProfile(jobSeeker.userID);
            const workingStatus = await SeekerWorkingStatus.getSeekerWorkingStatus(jobSeeker.userID);
            return {
                ...jobSeeker.dataValues, // Spread the user data
                seekerProfile: seekerProfile || null, // Include the profile if it exists
                workingStatus: workingStatus || null, // Include the working status if it exists
            };
            })
        );
        console.log('All job seekers:', allSeekerProfiles); // Debugging line
        res.status(200).json({ message : 'Fetched all jobSeekers/potential applicants' , 
            jobSeekers: allSeekerProfiles 
        });

       
    } catch (error) {
        console.error('Error fetching all jobseekers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export {
    createUser,
    loginUser,
    updateUserPassword,
    getAllJobSeekers
}