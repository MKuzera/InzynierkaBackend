const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class ConferenceService {
    static validateConferenceData(title, description, location, price, date) {
        return title && description && location && price && date;
    }

    static addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID) {
        const db = dbService.getConnection();
        const query = 'INSERT INTO conferences (title, description, location, organizers, tags, price, date, link, organizerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

        return new Promise((resolve, reject) => {
            db.query(query, [title, description, location, organizers, tags, price, date, link, organizerID], (err, results) => {
                if (err) {
                    reject('Error adding conference');
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async addConference(req, res) {
        const { title, description, location, organizers, tags, price, date, link, organizerID } = req.body;

        if (!this.validateConferenceData(title, description, location, price, date)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const results = await this.addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID);
            res.status(201).json({ message: 'Conference added successfully', conferenceId: results.insertId });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async getAllConferences(req, res) {
        const db = dbService.getConnection();
        const query = 'SELECT * FROM conferences';

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching conferences' });
            }
            res.json(results);
        });
    }

    static async getAllConferencesForCreator(req, res) {
        const authorId = req.params.authorId;
        const db = dbService.getConnection();
        const query = 'SELECT * FROM conferences WHERE organizerID = ?';

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
        const query = 'UPDATE conferences SET title = ?, description = ?, location = ?, organizers = ?, tags = ?, price = ?, date = ?, link = ?, organizerID = ? WHERE id = ?';

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
        const query = 'DELETE FROM conferences WHERE id = ?';

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
        const query = 'SELECT * FROM conferences WHERE id = ?';

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
