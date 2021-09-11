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
    db.allDepartments()
    // let employees = rows
        .then(([employees]) => {
            // const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            //     name: `${first_name} ${last_name}`,
            //     value: id
            // }))

    // db.allDepartments() 
    // .then(([rows]) => {
        const departmentChoices = employees.map(({ id, name }) => ({
            name: name,
            value: id

        }));

    // db.allEmployeesByDepartment()
    // .then(departments => {
        return inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department you would like to view?",
                choices: departmentChoices
            }
        ])
    .then(answer => {
        // return db.promise().query(`SELECT * from Employee where department_id=?`,answer.departmentId);
        const res= db.allEmployeesByDepartment( answer.departmentId)
        console.table(res)
    })
    .then(() => 
        console.log("\n"),
        // console.log(answer),
    )
    
    .then(() => promptUser())
    .catch(err => console.log(err))
   })
}

// View all employees by manager
function viewAllEmployeesByManager() {
    // db.allEmployeesByManager()
    // .then(([rows]) => {
    //     console.log("\n");
    //     console.table(rows);
    // })
    // .then(() => promptUser())
    // .catch(err => console.log(err));

    db.promise().query('SELECT *  FROM employee')
    .then((res) => {
        // make the choice dept arr
        return res[0].map(employee => {
            return {
                name: employee.first_name,
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
                message: 'Please select the manager you want to view employee by.'
            }
        ])
    })
    .then(answer => {
        console.log(answer);
        return connection.promise().query('SELECT * from Employee where manager_id=?',answer.managerId);

    })
    .then(res => {
        console.table(res[0])
        promptUser();
    })

    .catch(err => {
        throw err
    });
}

// Add an employee
function addEmployee() {
    return inquirer.prompt([        {
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
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));
                    return inquirer.prompt({
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's role?",
                        choices: roleChoices
                    })
                        .then(res => {
                            let roleId = res.roleId;

                            db.allEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));

                                    managerChoices.unshift({ name: "None", value: null });

                                    return inquirer.prompt({
                                        type: "list",
                                        name: "managerId",
                                        message: "Who is the employee's manager?",
                                        choices: managerChoices
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
                                        .then(() => console.log(
                                            `\n Added ${firstName} ${lastName} to the database \n`
                                        ))
                                        .then(() => promptUser())
                                })
                        })
                })
        })
}



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