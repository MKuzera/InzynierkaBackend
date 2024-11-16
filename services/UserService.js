const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class UserService {
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
}

module.exports = UserService;
