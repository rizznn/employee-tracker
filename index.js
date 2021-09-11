const inquirer = require('inquirer');
const db = require("./db");
// require("console.table");

function promptUser() {
    return inquirer.prompt([
        {
        type: "list",
        name: "userChoices",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Manager",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "View All Roles",
            "Add Role",
            "Remove Role",
            "View All Departments",
            "Add Department",
            "Remove Department",
            "Exit"
        ]
    }

    ]).then(answer => {
        switch (answer.userChoices) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View All Employees By Department":
                viewAllEmployeesByDepartment();
                break;
            case "View All Employees By Manager":
                viewAllEmployeesByManager();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Update Employee Manager":
                updateEmployeeManager();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "Add Role":
                addRole();
                break;
            case "Remove Role":
                removeRole();
                break;
            case "View All Departments":
                viewAllDepartments();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            default:
                quit();
        }
    }
    )
}

// "View All Employees",
// "View All Employees By Department",
// "View All Employees By Manager",
// "Add Employee",
// "Remove Employee",
// "Update Employee Role",
// "Update Employee Manager",
// "View All Roles",
// "Add Role",
// "Remove Role",
// "View All Departments",
// "Add Department",
// "Remove Department",
// "Exit"
// function viewAllDepartments {

// }
// function {

// }