const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();
const AuthService = require('./AuthService');

class ConferenceService {
    static validateConferenceData(title, description, location, price, date) {
        if (!title || !description || !location || !price || !date) {
            return false;
        }
        return true;
    }

    static validateUserRole(req, res) {
        const userType = req.userType;  // User type added by AuthService during token verification
        if (userType !== 'admin' && userType !== 'creator') {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
        }
        return true;
    }

    static getAllConferences(req, res) {
        if (!this.validateUserRole(req, res)) return;

        const query = 'SELECT * FROM conferences';
        const db = dbService.getConnection();

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences' });
            }
            res.json(results);
        });
    }

    static addConference(req, res) {
        if (!this.validateUserRole(req, res)) return;

        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const query = 'INSERT INTO conferences (title, description, location, organizers, tags, price, date, link, organizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const db = dbService.getConnection();

        db.query(query, [title, description, location, organizers, tags, price, date, link, organizerID], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding conference' });
            }
            res.status(201).json({ message: 'Conference added successfully', conferenceId: results.insertId });
        });
    }

    static editConference(req, res) {
        if (!this.validateUserRole(req, res)) return;

        const conferenceId = req.params.id;
        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const query = 'UPDATE conferences SET title = ?, description = ?, location = ?, organizers = ?, tags = ?, price = ?, date = ?, link = ?, organizerID = ? WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [title, description, location, organizers, tags, price, date, link, organizerID, conferenceId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error editing conference' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Conference not found' });
            }
            res.json({ message: 'Conference updated successfully' });
        });
    }

    static deleteConference(req, res) {
        if (!this.validateUserRole(req, res)) return;

        const conferenceId = req.params.id;
        const query = 'DELETE FROM conferences WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [conferenceId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting conference' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Conference not found' });
            }
            res.json({ message: 'Conference deleted successfully' });
        });
    }

    static getConference(req, res) {
        const conferenceId = req.params.id;
        const query = 'SELECT * FROM conferences WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [conferenceId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conference' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Conference not found' });
            }
            res.json(results[0]);
        });
    }
}

module.exports = ConferenceService;
