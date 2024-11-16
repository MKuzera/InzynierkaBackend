const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const DatabaseService = require('./DatabaseService');
const dbService = new DatabaseService();
app.post('/login', (req, res) => {
    const authHeader = req.headers['authorization'];
    const db = dbService.getConnection();

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const [login, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString('ascii')
        .split(':');

    const query = 'SELECT id, userType FROM users WHERE login = ? AND password = ?';
    db.query(query, [login, password], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid login or password' });
        }

        const user = results[0];

        const token = jwt.sign(
            { userId: user.id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            userType: user.userType,
            token: token,
        });
    });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

