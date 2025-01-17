const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class ConferenceService {
    static validateConferenceData(title, description, location, price, date) {
        return title && description && location && price && date;
    }

    static getAllConferencesQuery() {
        return 'SELECT * FROM conferences';
    }

    static addConferenceQuery() {
        return 'INSERT INTO conferences (title, description, location, organizers, tags, price, date, link, organizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    }

    static getAllConferencesForCreatorQuery() {
        return 'SELECT * FROM conferences WHERE organizerID = ?';
    }

    static editConferenceQuery() {
        return 'UPDATE conferences SET title = ?, description = ?, location = ?, organizers = ?, tags = ?, price = ?, date = ?, link = ?, organizerID = ? WHERE id = ?';
    }

    static deleteConferenceQuery() {
        return 'DELETE FROM conferences WHERE id = ?';
    }

    static getConferenceQuery() {
        return 'SELECT * FROM conferences WHERE id = ?';
    }

    static async getAllConferences(req, res) {
        const db = dbService.getConnection();
        const query = this.getAllConferencesQuery();

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences' });
            }
            res.json(results);
        });
    }

    static async addConference(req, res) {
        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const db = dbService.getConnection();
        const query = this.addConferenceQuery();

        db.query(query, [title, description, location, organizers, tags, price, date, link, organizerID], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding conference' });
            }
            res.status(201).json({ message: 'Conference added successfully', conferenceId: results.insertId });
        });
    }

    static async getAllConferencesForCreator(req, res) {
        const authorId = req.params.authorId;
        const db = dbService.getConnection();
        const query = this.getAllConferencesForCreatorQuery();

        db.query(query, [authorId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences for organizer' });
            }
            res.json(results);
        });
    }

    static async editConference(req, res) {
        const conferenceId = req.params.id;
        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const db = dbService.getConnection();
        const query = this.editConferenceQuery();

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

    static async deleteConference(req, res) {
        const conferenceId = req.params.id;
        const db = dbService.getConnection();
        const query = this.deleteConferenceQuery();

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

    static async getConference(req, res) {
        const conferenceId = req.params.id;
        const db = dbService.getConnection();
        const query = this.getConferenceQuery();

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
