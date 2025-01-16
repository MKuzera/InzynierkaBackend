const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class ConferenceService {
    static validateConferenceData(title, description, location, price, date) {
        if (!title || !description || !location || !price || !date) {
            return false;
        }
        return true;
    }

    static getAllConferences(req, res) {
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
    static getAllConferencesForCreator(req, res) {
        const authorId = req.params.authorId;
        const query = 'SELECT * FROM conferences WHERE organizerID = ?';
        const db = dbService.getConnection();

        db.query(query, [authorId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences for organizer' });
            }
            res.json(results);
        });
    }
    static editConference(req, res) {
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
