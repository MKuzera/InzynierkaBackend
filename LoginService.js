const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const DatabaseService = require('./DatabaseService');

const app = express();
const dbService = new DatabaseService();

app.use(bodyParser.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

app.post('/login', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const [login, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
        .toString('ascii')
        .split(':');

    const query = 'SELECT id, userType FROM users WHERE login = ? AND password = ?';
    const db = dbService.getConnection();

    db.query(query, [login, password], (err, results) => {
        if (err) {
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

app.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'You have access to protected data!',
        user: req.user,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
