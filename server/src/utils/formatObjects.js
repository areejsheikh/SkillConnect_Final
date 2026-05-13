const formatSeekerProfileObj = (userID, firstName, lastName, email) => {
    if (!userID || !firstName || !lastName || !email) return null;
    
    return {
        userID,
        firstName,
        lastName,
        email,
        profilePicTitle:'defaultPerson.png',
    };
}



// Function to merge the data
const formatApplicantsForPostData= (basicData, workingStatus, credentials, applicantsDetails) => {
  return basicData.map(basic => {
    const userID = basic.userID;

    // Find corresponding data from other arrays
    const workStatus = workingStatus.find(ws => ws.userID === userID) || {};
    const credential = credentials.find(c => c.userID === userID) || {};
    const applicantDetail = applicantsDetails.find(ad => ad.applicantID === userID) || {};

    // Combine all information into one object
    return {
      ...basic, // Include basic information
      ...workStatus, // Include working status
      ...credential, // Include credentials
      ...applicantDetail // Include application details
    };
  });
};
export {
    formatSeekerProfileObj,
    formatApplicantsForPostData
}
