const express = require('express');
const app = express();
require('dotenv').config();
const DatabaseService = require('./DatabaseService');
const dbService = new DatabaseService();

app.use(express.json());

app.get('/getallusers', (req, res) => {
    const query = 'SELECT * FROM users';
    const db = dbService.getConnection();

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
