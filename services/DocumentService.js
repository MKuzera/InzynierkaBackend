const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class DocumentService {
    static validateDocumentData(title, author, authorId, description, tags, dateAdded, link) {
        if (!title || !author || !authorId || !description || !tags || !dateAdded || !link) {
            return false;
        }
        return true;
    }

    static getAllDocuments(req, res) {
        const query = 'SELECT * FROM documents';
        const db = dbService.getConnection();

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching documents' });
            }
            res.json(results);
        });
    }

    static getDocument(req, res) {
        const documentId = req.params.id;
        const query = 'SELECT * FROM documents WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [documentId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching document' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.json(results[0]);
        });
    }

    static getAllDocumentsForAuthor(req, res) {
        const authorId = req.params.authorId;
        const query = 'SELECT * FROM documents WHERE authorId = ?';
        const db = dbService.getConnection();

        db.query(query, [authorId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching documents for author' });
            }
            res.json(results);
        });
    }

    static addDocument(req, res) {
        const { title, author, authorId, description, tags, dateAdded, link } = req.body;

        if (!this.validateDocumentData(title, author, authorId, description, tags, dateAdded, link)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const query = 'INSERT INTO documents (title, author, authorId, description, tags, dateAdded, link) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const db = dbService.getConnection();

        db.query(query, [title, author, authorId, description, tags, dateAdded, link], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding document' });
            }
            res.status(201).json({ message: 'Document added successfully', documentId: results.insertId });
        });
    }

    static editDocument(req, res) {
        const documentId = req.params.id;
        const { title, author, authorId, description, tags, dateAdded, link } = req.body;

        if (!this.validateDocumentData(title, author, authorId, description, tags, dateAdded, link)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const query = 'UPDATE documents SET title = ?, author = ?, authorId = ?, description = ?, tags = ?, dateAdded = ?, link = ? WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [title, author, authorId, description, tags, dateAdded, link, documentId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error editing document' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.json({ message: 'Document updated successfully' });
        });
    }

    static deleteDocument(req, res) {
        const documentId = req.params.id;
        const query = 'DELETE FROM documents WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [documentId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting document' });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Document not found' });
            }
            res.json({ message: 'Document deleted successfully' });
        });
    }
}

module.exports = DocumentService;
