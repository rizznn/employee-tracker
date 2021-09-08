const mysql = require('mysql2');
const express = require('express');

// PORT designation
const PORT = process.env.PORT || 3001;

// app expression
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'RVNN1704079217',
      database: 'employees'
    },
    console.log('Connected to the employees database.')
);

// db.query(`SELECT * FROM employee`, (err, rows) => {
//     console.log(rows);
// });  
// GET a single employee
db.query(`SELECT * FROM employee WHERE id = 1`, (err, row) => {
    if (err) {
      console.log(err);
    }
    console.log(row);
});

// // Delete a employee
// db.query(`DELETE FROM employee WHERE id = ?`, 1, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
// });
  
// Create a employee
const sql = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
              VALUES (?,?,?,?,?)`;
const params = [1, 'John', 'Doe', 1, 3];

db.query(sql, params, (err, result) => {
  if (err) {
    console.log(err);
  }
  console.log(result);
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  