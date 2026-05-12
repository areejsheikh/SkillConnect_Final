import SeekerProfile from '../models/seekerProfileModel.js';
import Users from '../models/usersModel.js';
import appliedJobs from '../models/appliedJobsModel.js';
import SavedJobs from '../models/savedJobsModel.js';

export const getCompleteSeekerDash = async (req, res) => {
    try {
        const { userID } = req.params;
        console.log('User ID from request:', userID); // Debugging line

        // Fetch user details
        console.log('Fetching user details for userID:', userID); // Debugging line
        const user = await Users.getUserByID(userID);
        if (!user) {
            console.log('User not found for userID:', userID); // Debugging line
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log('Fetched user details:', user); // Debugging line

        // Fetch applied jobs count
        console.log('Fetching applied jobs count for userID:', userID); // Debugging line
        const appliedJobsCount = await appliedJobs.getAppliedJobsCount(userID);
        if (appliedJobsCount === undefined) {
            console.log('Unable to fetch applied jobs count for userID:', userID); // Debugging line
            return res.status(404).json({
                success: false,
                message: 'Unable to fetch applied jobs count'
            });
        }
        console.log('Fetched applied jobs count:', appliedJobsCount); // Debugging line

        // Fetch saved jobs count
        console.log('Fetching saved jobs count for userID:', userID); // Debugging line
        const savedJobsCount = await SavedJobs.getSavedJobsCount(userID);
        if (savedJobsCount === undefined) {
            console.log('Unable to fetch saved jobs count for userID:', userID); // Debugging line
            return res.status(404).json({
                success: false,
                message: 'Unable to fetch saved jobs count'
            });
        }
        console.log('Fetched saved jobs count:', savedJobsCount); // Debugging line

        // Fetch recent applied jobs
        console.log('Fetching recent applied jobs for userID:', userID); // Debugging line
        const recentAppliedJobs = await appliedJobs.getActiveAppliedJobsOfUser(userID);
        if (!recentAppliedJobs) {
            console.log('Unable to fetch recent applied jobs for userID:', userID); // Debugging line
            return res.status(404).json({
                success: false,
                message: 'Unable to fetch Recent Applied jobs'
            });
        }
        console.log('Fetched recent applied jobs:', recentAppliedJobs); // Debugging line

        // Prepare seeker dashboard data
        console.log('Preparing seeker dashboard data for userID:', userID); // Debugging line
        const seekerDashData = {
            userID: user.userID,
            name: user.username,
            appliedJobsCount,
            savedJobsCount,
            recentAppliedJobsList: recentAppliedJobs
        };
        console.log('Prepared seeker dashboard data:', seekerDashData); // Debugging line

        return res.status(200).json({
            success: true,
            message: 'Complete seeker dash data successfully',
            data: seekerDashData
        });
    } 
    catch (error) {
        console.error('Error in getCompleteSeekerDash:', error); // Debugging line
        return res.status(500).json({
            success: false,
            message: 'Error fetching seeker dash data',
            error: error.message
        });
    }
};













