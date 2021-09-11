const db = require('../../db/connection');

class Employee {
    constructor (db) {
        this.connection = db;
    }

    // view all departments
    allDepartments() {
        return this.connection.query(
            `SELECT department.id, department.name AS department FROM department`
        );
    }

    // view all roles
    allRoles() {
        return this.connection.query(
            `SELECT role.id, role.title AS title, department.name AS department, role.salary AS salary FROM role LEFT JOIN department on role.department_id = department.id`
        );
    }

     // view all employees
     allEmployees() {
        return this.connection.query (
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
        );
    }

    // view all employees by department
    allEmployeesByDepartment() {
        return this.connection.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id
        WHERE department.id = ?`
        )
    }


    // view all employees by manager
    allEmployeesByManager() {
        return this.connection.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id
        WHERE manager.id = ?`
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
    updateEmployeeRole(employeeId,managerId) {
        return this.connection.promise().query(
            "UPDATE employee SET manager_id = ? WHERE id = ?",
            [managerId, employeeId]
        );
    }
 

    // delete a department
    deleteDepartment() {
        return this.connection.promise().query(` DELETE FROM Department WHERE id = ?`)
    } 

    // delete a role
    deleteRole() {
        return this.connection.promise().query(`DELETE FROM role WHERE id = ?`)
    }
   
    // delete an employee
    deleteEmployee() {
        return this.connection.promise().query(`DELETE FROM employee WHERE id = ?`)
    }

 
}

module.exports = new Employee (db)






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
