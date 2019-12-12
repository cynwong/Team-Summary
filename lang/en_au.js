module.exports = {
    processMessages: {
        teamMemberQuestion: "Select the team members",
        noStaffErrMessage: "\n*** No staff member is selected. At least one member must be selected.\n",
        savingFileStatus: "Saving file...",
        fileSavedStatus: (filename)=>`${filename} file is saved.`,
        errMessagePrefix: "Error in creating roster"
    },
    main: {
        usernameQuestion: "Who are you?",
        allStaffAssignedMessage: "All staff are assigned to a team. Exiting the program...",
        addMoreRosterQuestion: "Do you want to create more roster?",
        errMessagePrefix: "Error:"
    }
}