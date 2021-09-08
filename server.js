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

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  