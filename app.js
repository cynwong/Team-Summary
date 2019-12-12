const inquirer = require("inquirer");

const createRoster = require("./lib/process");

const EMPLOYEES = require("./lib/access_data");
const Manager = require("./lib/manager");

//separate managers from the rest
const managers = EMPLOYEES.filter((employee)=> employee instanceof Manager);
let members = EMPLOYEES.filter((employee)=> !(employee instanceof Manager));

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
            members = await createRoster(user,members);
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