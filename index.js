const inquirer = require('inquirer');
const db = require("./db");
const cTable = require("console.table");

function promptUser() {
    return inquirer.prompt([
        {
        type: "list",
        name: "userChoices",
        message: "What would you like to do?",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Manager",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Remove Department",
            "Remove Role",
            "Remove Employee",
            "Exit"
        ]
    }

    ]).then(answer => {
        switch (answer.userChoices) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Employees By Department":
                viewAllEmployeesByDepartment();
                break;
            case "View All Employees By Manager":
                viewAllEmployeesByManager();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            default:
                exit();
        }
    });
}

// View all departments
function viewAllDepartments() {
    db.allDepartments()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
    })
    .then(() => promptUser())
    .catch(err => console.log(err));
}

// View all roles
function viewAllRoles() {
    db.allRoles()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
    })
    .then(() => promptUser())
    .catch(err => console.log(err));
}

// View all employees
function viewAllEmployees() {
    db.allEmployees()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
    })
    .then(() => promptUser())
    .catch(err => console.log(err));
}

// View all employees by department
function viewAllEmployeesByDepartment() {
    db.allEmployeesByDepartment()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
    })
    .then(() => promptUser())
    .catch(err => console.log(err));
}

// View all employees by manager
function viewAllEmployeesByManager() {
    db.allEmployeesByManager()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
    })
    .then(() => promptUser())
    .catch(err => console.log(err));
}

// Add an employee



// "Remove Employee",
// "Update Employee Role",
// "Update Employee Manager",
// "Add Role",
// "Remove Role",
// "View All Departments",
// "Add Department",
// "Remove Department",


function exit() {
    db.quit();
}

promptUser();