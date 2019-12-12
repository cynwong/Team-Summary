const inquirer = require("inquirer");
const fs = require("fs");
const ejs = require("ejs");
const util = require("util");
const path = require("path");
const open = require("open");
const writeFileAsync = util.promisify(fs.writeFile);


const EMPLOYEES = require("./lib/access_data");
const Manager = require("./lib/manager");

//separate managers from the rest
const managers = EMPLOYEES.filter((employee)=> employee instanceof Manager);
const members = EMPLOYEES.filter((employee)=> !(employee instanceof Manager));

const OUTPUT_FOLDER = path.join(__dirname,"output");

const getFilename = (username)=>{
    username = username.replace(" ", "_").toLowerCase();
    return  `${username}_${new Date().getTime()}.html`;
};

const createRoster = async (user)=>{
    try{
        //add separator in console
        console.log("-".repeat(80));
        const filename = getFilename(user.name);
        const filePath = path.join(OUTPUT_FOLDER, filename);
        //ask user to select the team members.
        const {members:names} = await inquirer.prompt([
            {
                name:"members",
                message: "Select the team members",
                choices: members.filter(({name,available})=> {
                    if(available){
                        return name;
                    }
                }),
                type: "checkbox"
            }
        ]);
        // create a empty array for this team
        const team = [];

        members.forEach((member)=>{
            //check if a engineer or an intern is selected
            if(names.indexOf(member.name) !== -1){
                //if selected, change the member status to be assgined
                member.assigned();
                //add to the team. 
                team.push(member);
            }
        });
        //add manager to the team
        team.push(user);
        //render team info to html by using template. 
        const html = await ejs.renderFile("templates/main.ejs", 
            {
                team,
            }
        );
        //write file to the output folder
        console.log("Saving file...")
        await writeFileAsync(filePath, html);

        //open output file in the browser for the user. 
        console.log(`${filename} file is saved in the folder ${OUTPUT_FOLDER}.`)
        await open(filePath);
    }catch(err){
        console.log("Error in creating roster", err.message);
        process.exit();
    }
};


const start = async () => {
    try{
            // get the current user(manager)'s name from the managers objects
            const {user:username} = await inquirer.prompt([
                {
                    name: "user",
                    message: "Who are you?",
                    choices: managers.map(({name})=>name),
                    type: "list"
                }
            ]);

        //get current user object
        const [user] = managers.filter(manager=>manager.name.localeCompare(username)===0);
        let moreRoster = true;
        console.log(`Hello, ${user.getName()}.`);
        do{
            //create roster
            await createRoster(user);
            //check if all staff members have been assigned to a team.
            if(members.every(({available})=>!available)){
                // if yes, then cannot create more roster so exit the program. 
                console.log("All staff are assigned to a team. Exiting the program...")
                process.exit();
            }
            //ask user if they want to create more team roster
            const { addMore } = await inquirer.prompt([
                {
                    name: "addMore",
                    message: "Do you want to create more roster?",
                    type:"confirm"
                }
            ]);
            moreRoster = addMore;
            
        }while(moreRoster);
    }catch(err){
        console.log("Error:", err.message)
    }
};

start();