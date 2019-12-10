class Employee{
    constructor(name, id=null, email=""){
        this.id = id ? id : ++this.lastId;
        this.name = name;
        this.email = email;
    }

    getName(){
        return this.name;
    }

    getId(){
        return this.id ? this.id: "No ID";
    }

    getEmail(){
        return this.email ? this.email: "Undefined";
    }

    getRole(){
        return "Employee";
    }
};

Employee.lastId = 0;

module.exports = Employee;