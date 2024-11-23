const jwt = require('jsonwebtoken');
const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();
const bcrypt = require('bcrypt');

class AuthService {
    static login(req, res) {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        // Decode the base64 authorization header (username:password)
        const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
            .toString('ascii')
            .split(':');

        // Query to fetch the user based on username
        const query = 'SELECT id, type, password FROM users WHERE username = ?';
        const db = dbService.getConnection();

        db.query(query, [username], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' + err });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const user = results[0];

            // Compare the provided password with the stored hash
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Error comparing passwords' });
                }

                if (!isMatch) {
                    return res.status(401).json({ message: 'Invalid username or password' });
                }

                // If the password matches, generate a JWT token
                const token = jwt.sign(
                    { userId: user.id, userType: user.type },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return res.status(200).json({
                    message: 'Login successful',
                    userId: user.id,
                    userType: user.type,
                    token: token,
                });
            });
        });
    }

    static register(req, res) {
        const { login, password, email } = req.body;

        if (!login || !password || !email) {
            return res.status(400).json({ message: 'Login, password, and email are required' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }

            const query = 'INSERT INTO users (username, password, email, type) VALUES (?, ?, ?, ?)';
            const db = dbService.getConnection();

            db.query(query, [login, hashedPassword, email, "admin"], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Internal server error' + err });
                }

                return res.status(201).json({
                    message: 'Registration successful',
                    userId: results.insertId,
                });
            });
        });
    }



    static verifyToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.user = user;
            next();
        });
    }

    static isAdmin(req, res, next) {
        if (req.user && req.user.userType === 'admin') {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }
    static isCreator(req, res, next) {
        if (req.user.userType !== 'creator' && req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
        }
        next();
    }
    static isCreatorOrAdmin(req, res, next) {
        if (req.user.userType !== 'creator' && req.user.userType !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
        }
        next();
    }

    static about(req, res) {
        res.send('About birds');
    }
}

module.exports = AuthService;
