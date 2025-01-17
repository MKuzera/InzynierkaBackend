const DatabaseService = require('./DataBaseService');
const dbService = new DatabaseService();

class DocumentService {
    static validateDocumentData(title, author, authorId, description, tags, dateAdded, link) {
        return !!(title && author && authorId && description && tags && dateAdded && link);
    }

    static getAllDocuments(req, res) {
        this.getAllDocumentsQuery((err, results) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(results);
        });
    }

    static getDocument(req, res) {
        const documentId = req.params.id;
        this.getDocumentQuery(documentId, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(result);
        });
    }

    static getAllDocumentsForAuthor(req, res) {
        const authorId = req.params.authorId;
        this.getAllDocumentsForAuthorQuery(authorId, (err, results) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(results);
        });
    }

    static addDocument(req, res) {
        const { title, author, authorId, description, tags, dateAdded, link } = req.body;

        if (!this.validateDocumentData(title, author, authorId, description, tags, dateAdded, link)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        this.addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.status(201).json(result);
        });
    }

    static editDocument(req, res) {
        const documentId = req.params.id;
        const { title, author, authorId, description, tags, dateAdded, link } = req.body;

        if (!this.validateDocumentData(title, author, authorId, description, tags, dateAdded, link)) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        this.editDocumentQuery(documentId, title, author, authorId, description, tags, dateAdded, link, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(result);
        });
    }

    static deleteDocument(req, res) {
        const documentId = req.params.id;
        this.deleteDocumentQuery(documentId, (err, result) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            res.json(result);
        });
    }

    static getAllDocumentsQuery(callback) {
        const query = 'SELECT * FROM documents';
        const db = dbService.getConnection();

        db.query(query, (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error fetching documents' });
            }
            callback(null, results);
        });
    }

    static getDocumentQuery(documentId, callback) {
        const query = 'SELECT * FROM documents WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [documentId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error fetching document' });
            }
            if (results.length === 0) {
                return callback({ status: 404, message: 'Document not found' });
            }
            callback(null, results[0]);
        });
    }

    static getAllDocumentsForAuthorQuery(authorId, callback) {
        const query = 'SELECT * FROM documents WHERE authorId = ?';
        const db = dbService.getConnection();

        db.query(query, [authorId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error fetching documents for author' });
            }
            callback(null, results);
        });
    }

    static addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, callback) {
        const query = 'INSERT INTO documents (title, author, authorId, description, tags, dateAdded, link) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const db = dbService.getConnection();

        db.query(query, [title, author, authorId, description, tags, dateAdded, link], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error adding document' });
            }
            callback(null, { message: 'Document added successfully', documentId: results.insertId });
        });
    }

    static editDocumentQuery(documentId, title, author, authorId, description, tags, dateAdded, link, callback) {
        const query = 'UPDATE documents SET title = ?, author = ?, authorId = ?, description = ?, tags = ?, dateAdded = ?, link = ? WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [title, author, authorId, description, tags, dateAdded, link, documentId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error editing document' });
            }
            if (results.affectedRows === 0) {
                return callback({ status: 404, message: 'Document not found' });
            }
            callback(null, { message: 'Document updated successfully' });
        });
    }

    static deleteDocumentQuery(documentId, callback) {
        const query = 'DELETE FROM documents WHERE id = ?';
        const db = dbService.getConnection();

        db.query(query, [documentId], (err, results) => {
            if (err) {
                return callback({ status: 500, message: 'Error deleting document' });
            }
            if (results.affectedRows === 0) {
                return callback({ status: 404, message: 'Document not found' });
            }
            callback(null, { message: 'Document deleted successfully' });
        });
    }
}

module.exports = DocumentService;
