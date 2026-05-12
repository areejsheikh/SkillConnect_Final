import JobPostings from "../models/jobPostingsModel.js";
import appliedJobs from "../models/appliedJobsModel.js";

export const createJobPosting = async (req, res) => {
  try {
    const { recruiterID } = req.params;
    const newJobData = req.body;
    const newJob = await JobPostings.createJobPost(newJobData);
    res.status(201).json({ message: "Job posted successfully", data: newJob });
  } catch (error) {
    console.error("Error creating job post:", error);
    res.status(500).json({ message: "Failed to create job posting" });
  }
};

export const getAllOpenJobs = async (req, res) => {
  try {
    const openJobs = await JobPostings.getAllOpenJobs();

    if (!openJobs || openJobs.length === 0) {
      console.log("No open jobs found");
      return res.status(404).json({ message: "No open jobs found" });
    }
    console.log("Open jobs fetched successfully:", openJobs.length);
    res.status(200).json({ data: openJobs });
  } catch (error) {
    console.error("Error fetching open jobs:", error);

    if (error.name === "SequelizeDatabaseError") {
      return res.status(400).json({ message: "Invalid query or database error" });
    }

    res.status(500).json({ message: "Failed to fetch open jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    //console.log("Fetching job by ID:", req.params);
    const { jobPostID } = req.params;
    const job = await JobPostings.getJobById(jobPostID);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ data: job });
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ message: "Failed to fetch job details" });
  }
};

export const getRecruiterJobPosts = async (req, res) => {
  try {
    //console.log("Fetching job by ID:", req.params);
    const { recruiterID } = req.params;
    const jobPosts = await JobPostings.getRecruiterJobPosts(recruiterID);
    if (!jobPosts || jobPosts.length === 0) {
      console.log("No job posts found for this recruiter");
      return res.status(404).json({ message: "No job posts available for this user" });
    }
    const jobPostsWithApplicants = await Promise.all(
      jobPosts.map(async (jobPost) => {
      const applicantsCount = await appliedJobs.getApplicantsCountForRecruiterPost(jobPost.jobPostID);
      return { ...jobPost.dataValues, applicantsCount };
      })
    );
    res.status(200).json({ data: jobPostsWithApplicants, message: "Job posts of recruiter fetched successfully" });

  } catch (error) {
    console.error("Error fetching jobPosts of recruiter:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateJobPosting = async (req, res) => {
  try {
    const { jobPostID } = req.params;
    const updateData = req.body;

    const [updatedCount] = await JobPostings.update(updateData, {
      where: { jobPostID },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Job not found or no changes made" });
    }

    res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job posting:", error);
    res.status(500).json({ message: "Failed to update job posting" });
  }
};

export const closeJobPosting = async (req, res) => {
  try {
    const { jobPostID } = req.params;
    const updated = await JobPostings.closeJobPosting(jobPostID);
    res.status(200).json({ message: "Job closed successfully", updated });
  } catch (error) {
    console.error("Error closing job posting:", error);
    res.status(500).json({ message: "Failed to close job posting" });
  }
};

export const deleteJobPosting = async (req, res) => {
  try {
    const { jobPostID } = req.params;
    const deletedCount = await JobPostings.destroy({ where: { jobPostID } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Job not found or already deleted" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    res.status(500).json({ message: "Failed to delete job posting" });
  }
};

export const filterJobs = async (req, res) => {
  try {
    const { jobSetup, jobLocation, salaryRange } = req.query;
    const filters = {};

    if (jobSetup) filters.jobSetup = jobSetup;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (salaryRange) filters.salaryRange = salaryRange;

    const jobs = await JobPostings.findAll({ where: filters });
    res.status(200).json({ data: jobs });
  } catch (error) {
    console.error("Error filtering jobs:", error);
    res.status(500).json({ message: "Failed to filter jobs" });
  }
};
