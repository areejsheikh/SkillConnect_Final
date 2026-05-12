import SeekerCredentials from "../models/seekerCredentialsModel.js";
import SeekerWorkingStatus from "../models/seekerWorkingStatusModel.js";

export const getResume = async (req, res) => {
  try {
    const { userID } = req.params;
    const workingStatus = await SeekerWorkingStatus.getSeekerWorkingStatus(userID);
    const credentials = await SeekerCredentials.getUserCredentials(userID);

    res.status(200).json({ workingStatus, credentials });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

export const updateResume = async (req, res) => {
  try {
    const { userID } = req.params;
    const { primaryRole, company, experience, workSetup } = req.body;

    const updates = {};
    if (primaryRole) updates.primaryRole = primaryRole;
    if (company) updates.company = company;
    if (experience) updates.experience = experience;
    if (workSetup) updates.workSetup = workSetup;

    const updated = await SeekerWorkingStatus.updateWorkingStatusFields(userID, updates);
    res.status(200).json({ message: "Resume updated successfully", updated });
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ message: "Failed to update resume" });
  }
};

export const addCredential = async (req, res) => {
  try {
    const { userID } = req.params;
    const { credential } = req.body;
    const newCredential = await SeekerCredentials.addCredential(userID, credential);
    res.status(201).json({ message: "Credential added successfully", data: newCredential });
  } catch (error) {
    console.error("Error adding credential:", error);
    res.status(500).json({ message: "Failed to add credential" });
  }
};

export const deleteCredential = async (req, res) => {
  try {
    const { credID } = req.params;
    const deleted = await SeekerCredentials.deleteCredential(credID);
    res.status(200).json({ message: "Credential deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting credential:", error);
    res.status(500).json({ message: "Failed to delete credential" });
  }
};

export const getCredentials = async (req, res) => {
  try {
    const { userID } = req.params;
    const credentials = await SeekerCredentials.getUserCredentials(userID);
    res.status(200).json({ data: credentials });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    res.status(500).json({ message: "Failed to fetch credentials" });
  }
};
