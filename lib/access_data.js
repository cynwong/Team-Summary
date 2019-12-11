const data = require("../data/employees");
const Engineer = require("../lib/engineer");
const Manager = require("../lib/manager");
const Intern = require("../lib/intern");


const createObject = ({ name, role, id, email, officeNumber, github, school }) => {
    name = name.trim();
    email = email.trim();
    if (!name) { throw new Error("Invalid data. Employee name cannot be read."); }
    if (!id) { throw new Error("Invalid data. Employee id cannot be read."); }
    if (!email) { throw new Error("Invalid data. Employee email cannot be read."); }

    switch (role.toLowerCase()) {
        case "manager":
            return new Manager(name, id, email, officeNumber);
        case "engineer":
            return new Engineer(name, id, email, github);
        case "intern":
            return new Intern(name, id, email, school);
    }
};

module.exports = data.map(createObject);
