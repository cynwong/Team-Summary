const inquirer = require("inquirer");
const fs = require("fs");
const ejs = require("ejs");
const util = require("util");
const path = require("path");
const open = require("open");
const writeFileAsync = util.promisify(fs.writeFile);

const {outputFolder,lang} = require("../config");
const {
        processMessages: {
            teamMemberQuestion,
            noStaffErrMessage, 
            savingFileStatus,
            fileSavedStatus,
            errMessagePrefix
        }
    } = require(`../lang/${lang}`)

/**
 * construct the file name with the user's name and current timestamp
 * @param {string} username 
 * @return {string} filename
 */
const getFilename = (username)=>{
    username = username.replace(" ", "_").toLowerCase();
    return  `${username}_${new Date().getTime()}.html`;
};

/**
 * Create a roster html output file from the user's choices. 
 * @param {Manager} user Selected Manager object
 * @param {array} members array of other employee objects. 
 * @return {array} members return member objects array back the start function for further process. 
 */
const createRoster = async (user, members)=>{
    try{

        //create the team array with the manager
        const team = [user];

        // get destination file path
        const filename = getFilename(user.name);
        const filePath = path.join(outputFolder, filename);

        //ask user to select the team members.
        const getMemberNamesFromUser = async ()=>{
            //add separator in console
            console.log("-".repeat(80));
            const {teamMembers} = await inquirer.prompt([
                {
                    name:"teamMembers",
                    message: teamMemberQuestion,
                    choices: members.filter(({name,available})=> {
                        if(available){
                            return name;
                        }
                    }),
                    type: "checkbox"
                }
            ]);
            let names = teamMembers; 
            if(names.length === 0){
                console.log(noStaffErrMessage);
                name = await getMemberNamesFromUser();
            }
            return names; 
        };
        
        const names = await getMemberNamesFromUser();
        
        members.forEach((member)=>{
            //check if a engineer or an intern is selected
            if(names.indexOf(member.name) !== -1){
                //if selected, change the member status to be assgined
                member.assigned();
                //add to the team. 
                team.push(member);
            }
        });
        
        //render team info to html by using template. 
        const html = await ejs.renderFile("templates/main.ejs", 
            {
                team,
            }
        );
        //write file to the output folder
        console.log(savingFileStatus);
        await writeFileAsync(filePath, html);

        //open output file in the browser for the user. 
        console.log(fileSavedStatus(filename));
        await open(filePath);
        await open(outputFolder);
        
        return members;
    }catch(err){
        console.log(errMessagePrefix, err.message);
        process.exit();
    }
};

module.exports = createRoster;