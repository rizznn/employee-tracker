const db = require('../db/connection');

class EmployeeDB {
    constructor (db) {
        this.connection = db;
    }

    // view all departments
    allDepartments() {
        return this.connection.promise().query(
            `SELECT department.id, department.name AS department FROM department`
        );
    }

    // view all roles
    allRoles() {
        return this.connection.promise().query(
            `SELECT role.id, role.title AS title, department.name AS department, role.salary AS salary FROM role LEFT JOIN department on role.department_id = department.id`
        );
    }

     // view all employees
     allEmployees() {
        return this.connection.promise().query (
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
        );
    }

    // view all employees by department
    allEmployeesByDepartment(departmentId) {
        return this.connection.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name, role.salary AS salary, concat(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id
        WHERE department_id = ?`, departmentId
        )
    }


    // view all employees by manager
    allEmployeesByManager(manager_id) {
        return this.connection.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, concat(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id
        WHERE manager.id = ?`, manager_id
        )
    }


    // add a department
    addDepartment(department) {
        return this.connection.promise().query(`INSERT INTO department SET ?`, department)
    }

    // add a role
    addRole(role) {
        return this.connection.promise().query(`INSERT INTO role SET ?`, role)
    }

    // add an employee
    addEmployee(employee) {
        return this.connection.promise().query('INSERT INTO employee SET ?', employee)
    }


    // update an employee role
    updateEmployeeRole(employeeId, roleId) {
        return this.connection.promise().query(
            "UPDATE employee SET role_id = ? WHERE id = ?",
            [roleId, employeeId]
        );
    }

    // update an employee manager
    updateEmployeeManager(employeeId,managerId) {
        return this.connection.promise().query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [managerId, employeeId]
        );
    }
 

    // delete a department
    deleteDepartment(department) {
        return this.connection.promise().query(`DELETE FROM department WHERE id = ?`, department)
    } 

    // delete a role
    deleteRole(role) {
        return this.connection.promise().query(`DELETE FROM role WHERE id = ?`, role)
    }
   
    // delete an employee
    deleteEmployee(employee) {
        return this.connection.promise().query(`DELETE FROM employee WHERE id = ?`, employee)
    }

    quit() {
        this.connection.end();
    }
 
}

module.exports = new EmployeeDB (db)






   // db.query(sql, (err, rows) => {
    //   if (err) {
    //     res.status(500).json({ error: err.message });
    //     return;
    //   }
    //   res.json({
    //     message: 'success',
    //     data: rows
    //   });
    // });
