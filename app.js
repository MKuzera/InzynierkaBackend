const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');

const app = express();
app.use(bodyParser.json());

app.post('/adduser', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.addUser(req, res);
});

app.put('/edituser/:id', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.editUser(req, res);
});

app.delete('/deleteuser/:id', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.deleteUser(req, res);
});

app.get('/getallusers', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.getAllUsers(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
