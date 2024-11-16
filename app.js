const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
// const AuthService = require('./services/AuthService');
// const UserService = require('./services/UserService');
//
// const app = express();
//
// app.use(bodyParser.json());
//
// app.post('/api/login', (req, res) => {
//     AuthService.login(req, res);
// });
//
// app.get('/api/about', (req, res) => {
//     AuthService.about(req, res);
// });
//
// app.get('/getallusers', (req, res) => {
//     UserService.getAllUsers(req, res);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
