const jwt = require('jsonwebtoken');
const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class AuthService {
    static login(req, res) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
            .toString('ascii')
            .split(':');

        const query = 'SELECT id, type FROM users WHERE username = ? AND password = ?';
        const db = dbService.getConnection();

        db.query(query, [username, password], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Internal server error' + err });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const user = results[0];

            return res.status(403).json({user : user.id});
            const token = jwt.sign(
                { userId: user.id, userType: user.type }, // Zmieniono 'userType' na 'type' zgodnie z tabelą
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                message: 'Login successful',
                userType: user.type, // Zmieniono 'userType' na 'type'
                token: token,
            });
        });
    }

    static about(req, res) {
        res.send('About birds');
    }
}

module.exports = AuthService;
