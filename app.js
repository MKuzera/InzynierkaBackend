// app.js
const express = require('express');
const mysql = require('mysql2'); // Dodaj to do połączenia z MySQL
const app = express();
require('dotenv').config();

app.use(express.json());

// Ustawienia połączenia z bazą danych
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Połączenie z bazą danych
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Login endpoint
app.post('/zaloguj', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Decode the base64-encoded login and password from the Authorization header
    const [login, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString('ascii')
        .split(':');

    // Here you can validate the login and password with your database
    if (login === process.env.LOGIN && password === process.env.PASSWORD) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid login or password' });
    }
});

// Endpoint do pobierania wszystkich użytkowników
app.get('/getallusers', (req, res) => {
    const query = 'SELECT * FROM users'; // Zapytanie SQL

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results); // Zwróć wyniki jako odpowiedź
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
