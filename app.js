const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const DatabaseService = require('./DatabaseService');
const LoginService = require('./LoginService');

const app = express();
const dbService = new DatabaseService();

app.use(bodyParser.json());
app.use('/api', LoginService);

app.get('/getallusers', (req, res) => {
    const query = 'SELECT * FROM users';
    const db = dbService.getConnection();

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
