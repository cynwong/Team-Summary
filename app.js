const inquirer = require("inquirer");

const EMPLOYEES = require("./lib/access_data");
const Manager = require("./lib/manager");

const managers = EMPLOYEES.filter((employee)=> employee instanceof Manager);
const members = EMPLOYEES.filter((employee)=> !(employee instanceof Manager));

let user = null;

const createRoster = async ()=>{
    console.log("-".repeat(60));
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
    console.log(names);
    const teamMembers = [];
    for(let name of names){
        const member =members.find(member => member.name.localeCompare(name));
        if (member) {
            member.assigned();
            teamMembers.push(member);
        }
        
    }
    console.log(teamMembers)
}
// console.log(managers.map(({name})=>name));
const start = async () => {
    const {user:username} = await inquirer.prompt([
        {
            name: "user",
            message: "Who are you?",
            choices: managers.map(({name})=>name),
            type: "list"
        }
    ]);

    [user] = managers.filter(manager=>manager.name.localeCompare(username)===0);

    console.log(`Hello, ${user.getName()}.`);
    createRoster(true);
};

// console.log('hello');
start();