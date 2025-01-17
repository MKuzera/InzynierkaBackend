const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class ConferenceService {
    static validateConferenceData(title, description, location, price, date) {
        return title && description && location && price && date;
    }

    static addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID, callback) {
        const db = dbService.getConnection();
        const query = 'INSERT INTO conferences (title, description, location, organizers, tags, price, date, link, organizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        db.query(query, [title, description, location, organizers, tags, price, date, link, organizerID], (err, results) => {
            callback(err, results);
        });
    }

    static editConferenceQuery(conferenceId, title, description, location, organizers, tags, price, date, link, organizerID, callback) {
        const db = dbService.getConnection();
        const query = 'UPDATE conferences SET title = ?, description = ?, location = ?, organizers = ?, tags = ?, price = ?, date = ?, link = ?, organizerID = ? WHERE id = ?';

        db.query(query, [title, description, location, organizers, tags, price, date, link, organizerID, conferenceId], (err, results) => {
            callback(err, results);
        });
    }

    static deleteConferenceQuery(conferenceId, callback) {
        const db = dbService.getConnection();
        const query = 'DELETE FROM conferences WHERE id = ?';

        db.query(query, [conferenceId], (err, results) => {
            callback(err, results);
        });
    }

    static getConferenceQuery(conferenceId, callback) {
        const db = dbService.getConnection();
        const query = 'SELECT * FROM conferences WHERE id = ?';

        db.query(query, [conferenceId], (err, results) => {
            callback(err, results);
        });
    }

    static getAllConferencesQuery(callback) {
        const db = dbService.getConnection();
        const query = 'SELECT * FROM conferences';

        db.query(query, (err, results) => {
            callback(err, results);
        });
    }

    static getAllConferencesForCreatorQuery(authorId, callback) {
        const db = dbService.getConnection();
        const query = 'SELECT * FROM conferences WHERE organizerID = ?';

        db.query(query, [authorId], (err, results) => {
            callback(err, results);
        });
    }

    static addConference(req, res) {
        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        this.addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding conference' });
            }
            res.status(201).json({ message: 'Conference added successfully', conferenceId: results.insertId });
        });
    }

    static editConference(req, res) {
        const conferenceId = req.params.id;
        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        this.editConferenceQuery(conferenceId, title, description, location, organizers, tags, price, date, link, organizerID, (err, results) => {
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

        this.deleteConferenceQuery(conferenceId, (err, results) => {
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

        this.getConferenceQuery(conferenceId, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conference' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Conference not found' });
            }
            res.json(results[0]);
        });
    }

    static getAllConferences(req, res) {
        this.getAllConferencesQuery((err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences' });
            }
            res.json(results);
        });
    }

    static getAllConferencesForCreator(req, res) {
        const authorId = req.params.authorId;

        this.getAllConferencesForCreatorQuery(authorId, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences for organizer' });
            }
            res.json(results);
        });
    }
}

module.exports = ConferenceService;
