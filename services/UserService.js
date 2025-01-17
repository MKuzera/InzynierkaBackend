const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class UserService {
    static validateUserType(type) {
        const validTypes = ['admin', 'creator', 'user'];
        return validTypes.includes(type);
    }

    static getAllUsers(req, res) {
        this.getAllUsersQuery((err, results) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(results);
        });
    }

    static addUser(req, res) {
        const { username, password, email, type } = req.body;

        this.addUserQuery(username, password, email, type, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.status(201).json(result);
        });
    }

    static editUser(req, res) {
        const userId = req.params.id;
        const { username, password, email, type } = req.body;

        this.editUserQuery(userId, username, password, email, type, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(result);
        });
    }

    static deleteUser(req, res) {
        const userId = req.params.id;

        this.deleteUserQuery(userId, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(result);
        });
    }

    static getUser(req, res) {
        const userId = req.params.id;

        this.getUserQuery(userId, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(result);
        });
    }

    static getAllUsersQuery(callback) {
        const query = 'SELECT * FROM users';
        const db = dbService.getConnection();

        db.query(query, (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error fetching users' });
            }
            callback(null, results);
        });
    }

    static addUserQuery(username, password, email, type, callback) {
        if (!this.validateUserType(type)) {
            return callback({ status: 400, message: 'Invalid user type. Allowed values: admin, creator, user' });
        }

        const query = 'INSERT INTO users (username, password, email, type) VALUES (?, ?, ?, ?)';
        const db = dbService.getConnection();

        db.query(query, [username, password, email, type], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error adding user' + err });
            }
            callback(null, { message: 'User added successfully', userId: results.insertId });
        });
    }

    static editUserQuery(userId, username, password, email, type, callback) {
        if (!this.validateUserType(type)) {
            return callback({ status: 400, message: 'Invalid user type. Allowed values: admin, creator, user' });
        }

        const query = 'UPDATE users SET username = ?, password = ?, email = ?, type = ? WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [username, password, email, type, userId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error editing user' });
            }
            if (results.affectedRows === 0) {
                return callback({ status: 404, message: 'User not found' });
            }
            callback(null, { message: 'User updated successfully' });
        });
    }

    static deleteUserQuery(userId, callback) {
        const query = 'DELETE FROM users WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [userId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error deleting user' });
            }
            if (results.affectedRows === 0) {
                return callback({ status: 404, message: 'User not found' });
            }
            callback(null, { message: 'User deleted successfully' });
        });
    }

    static getUserQuery(userId, callback) {
        const query = 'SELECT * FROM users WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [userId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error fetching user' });
            }
            if (results.length === 0) {
                return callback({ status: 404, message: 'User not found' });
            }
            callback(null, results[0]);
        });
    }
}

module.exports = UserService;
