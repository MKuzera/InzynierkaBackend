// app.js
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
