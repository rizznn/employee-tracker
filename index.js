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
        promptUser();
    })
    .catch(err => console.log(err));
}

// View all roles
function viewAllRoles() {
    db.allRoles()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
        promptUser();
    })
    .catch(err => console.log(err));
}

// View all employees
function viewAllEmployees() {
    db.allEmployees()
    .then(([rows]) => {
        console.log("\n");
        console.table(rows);
        promptUser();
    })
    .catch(err => console.log(err));
}

// View all employees by department
function viewAllEmployeesByDepartment() {
    db.allDepartments()
    .then((res) => {
        return res[0].map(department => {
            return {
                name: department.department,
                value: department.id
            }
        })
    })
    .then(async (departmentList) => {
        return inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department you would like to view?",
                choices: departmentList
            }
        ])
    })
    .then(answer => {
        return db.allEmployeesByDepartment(answer.departmentId);
    })
    .then(res => {
        console.table(res[0])
        promptUser();
    })
    .catch(err => console.log(err));
}

// View all employees by manager
function viewAllEmployeesByManager() {
    db.allEmployees()
    .then((res) => {
        return res[0].map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
    })
    .then(async (managerList) => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'managerId',
                choices: managerList,
                message: 'Which manager you want to view the employee(s) by?'
            }
        ])
    })
    .then(answer => {
        return db.allEmployeesByManager(answer.managerId);
    })
    .then(res => {
        console.table(res[0])
        promptUser();
    })
    .catch(err => console.log(err));
}

// Add a department
function addDepartment() {
    return inquirer.prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            db.addDepartment(res)
            .then(() => console.log(`Added ${res.name} to the database\n`))
            .then(() => promptUser())
        })
        .catch(err => console.log(err));
}

// add a role
function addRole() {
    db.allDepartments()
    .then((res) => {
        return res[0].map(department => {
            return {
                name: department.department,
                value: department.id
            }
        })
    })
    .then(async (departmentList) => {
        return inquirer.prompt([
            {
                name: "title",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                message: "What is the salary for this role?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role fall in under?",
                choices: departmentList
            }
        ])
        .then(role => {
            db.addRole(role)
        .then(() => console.log(`Added ${role.title} to the database\n`))
        .then(() => promptUser())
        })
        .catch(err => console.log(err));
    })
}


// Add an employee
function addEmployee() {
    return inquirer.prompt([        
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
    .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.allRoles()
            .then(([rows]) => {
                let roles = rows;
                const roleList = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));
                return inquirer.prompt({
                    type: "list",
                    name: "roleId",
                    message: "What is the employee's role?",
                    choices: roleList
                })
                .then(res => {
                    let roleId = res.roleId;

                    db.allEmployees()
                        .then(([rows]) => {
                            let employees = rows;
                            const managerList = employees.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            managerList.unshift({ name: "None", value: null });

                            return inquirer.prompt({
                                type: "list",
                                name: "managerId",
                                message: "Who is the employee's manager?",
                                choices: managerList
                            })
                            .then(res => {
                                let employee = {
                                    manager_id: res.managerId,
                                    role_id: roleId,
                                    first_name: firstName,
                                    last_name: lastName
                                }

                                db.addEmployee(employee);
                            })
                            .then(() => {
                                console.log(`\n Added ${firstName} ${lastName} to the database \n`),
                                promptUser()
                            })
                            .catch(err => console.log(err));
                        })
                })
        })
    })
}

// Update an employee role
function updateEmployeeRole() {
    db.allEmployees()
    .then((res) => {
        return res[0].map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
    })
    .then(async (employeeList) => {
        return inquirer.prompt(
            {
                type: 'list',
                name: 'employeeListId',
                choices: employeeList,
                message: "Whose employee's role you want to update?"
            }
        )
    })
    .then(res => {
        let employeeListId = res.employeeListId;

        db.allRoles()
        .then((res) => {
            return res[0].map(role => {
                return {
                    name: role.title,
                    value: role.id,
                }
            })
        }) 
        .then((roleList) => {
            return inquirer.prompt(       
                {
                    type: 'list',
                    name: 'roleId',
                    choices: roleList,
                    message: 'Please select the role.'
                }
            )
        })
        .then(answer => {
            return db.updateEmployeeRole(employeeListId, answer.roleId);
        })
        .then(res => {
            // console.log(res);
            console.log(`Updated employee's role\n`);
            promptUser();
        })
        .catch(err => console.log(err));
    });
}

// Update employee manager
function updateEmployeeManager() {
    db.allEmployees()
    .then((res) => {
        return res[0].map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
    })
    .then(async (employeeList) => {
        return inquirer.prompt(
            {
                type: 'list',
                name: 'employeeListId',
                choices: employeeList,
                message: "Which employee's manager do you want to update?"
            })
        })
    .then(res => {
        let employeeListId = res.employeeListId;

    db.allEmployees()
    .then((res) => {
        return res[0].map(manager => {
            return {
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id,
            }
        })
    }) 
    .then((managerList) => {

        managerList.unshift({ name: "None", value: null });

        return inquirer.prompt(
            {
                type: 'list',
                name: 'managerId',
                choices: managerList,
                message: "Which employee do you want to set as manager for the selected employee?"
            })
    })
    .then(answer => {
        return db.updateEmployeeManager(employeeListId, answer.managerId);
    })
    .then(res => {
        // console.log(res);
        console.log("Updated employee's manager\n");
        promptUser();
    })
    .catch(err => console.log(err));    
    })
}

// Remove department
function removeDepartment() {
    db.allDepartments()
    .then((res) => {
        return res[0].map(department => {
            return {
                name: department.department,
                value: department.id
            }
        })
    })
    .then((departmentList) => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'departmentId',
                choices: departmentList,
                message: 'Which department you want to delete?'
            }
        ])
    })
    .then(answer => {
        return db.deleteDepartment(answer.departmentId);
    })
    .then(res => {
        // console.log(res);
        console.log('Department Deleted Successfully\n')
        promptUser();
    })
    .catch(err => console.log(err));    
}

// Remove role
function removeRole() {
    db.allRoles()
    .then((res) => {
        return res[0].map(roles => {
            return {
                name: roles.title,
                value: roles.id
            }
        })
    })
    .then((roleList) => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                choices: roleList,
                message: 'Which role you want to delete?'
            }
        ])
    })
    .then(answer => {
        return db.deleteRole(answer.roleId);
    })
    .then(res => {
        // console.log(res);
        console.log('Role Deleted Successfully\n')
        promptUser();
    })
    .catch(err => console.log(err));
}

// Remove employee
function removeEmployee() {
    db.allEmployees()
    .then((res) => {
        return res[0].map(employee => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })
    })
    .then((employees) => {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                choices: employees,
                message: 'Please select an employee to delete'
            }
        ])
    })
    .then(answer => {
        return db.deleteEmployee(answer.employeeId);
    })
    .then(res => {
        // console.log(res);
        console.log('Employee Deleted Successfully\n')
        promptUser();
    })
    .catch(err => console.log(err));
}

function exit() {
    db.quit();
}

promptUser();