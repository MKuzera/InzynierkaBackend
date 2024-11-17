const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class UserService {
    static validateUserType(type) {
        const validTypes = ['admin', 'creator', 'user'];
        return validTypes.includes(type);
    }

    static getAllUsers(req, res) {
        const query = 'SELECT * FROM users';
        const db = dbService.getConnection();

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching users' });
            }
            res.json(results);
        });
    }

    static addUser(req, res) {
        const { username, password, email, type } = req.body;

        if (!this.validateUserType(type)) {
            return res.status(400).json({ message: 'Invalid user type. Allowed values: admin, creator, user' });
        }

        const query = 'INSERT INTO users (username, password, email, type) VALUES (?, ?, ?, ?)';
        const db = dbService.getConnection();

        db.query(query, [username, password, email, type], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding user' });
            }
            res.status(201).json({ message: 'User added successfully', userId: results.insertId });
        });
    }

    static editUser(req, res) {
        const userId = req.params.id;
        const { username, password, email, type } = req.body;

        if (!this.validateUserType(type)) {
            return res.status(400).json({ message: 'Invalid user type. Allowed values: admin, creator, user' });
        }

        const query = 'UPDATE users SET username = ?, password = ?, email = ?, type = ? WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [username, password, email, type, userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error editing user' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User updated successfully' });
        });
    }

    static deleteUser(req, res) {
        const userId = req.params.id;
        const query = 'DELETE FROM users WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting user' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        });
    }

    static getUser(req, res) {
        const userId = req.params.id;
        const query = 'SELECT * FROM users WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [userId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(results[0]);
        });
    }
    static getUserByName(req, res) {
        const userName = req.params.name;
        const query = 'SELECT * FROM users WHERE name = ?';
        const db = dbService.getConnection();

        db.query(query, [userName], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching user' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(results[0]);
        });
    }
}

module.exports = UserService;  // Export with ES module syntax
