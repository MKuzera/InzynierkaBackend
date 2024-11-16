const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');

const app = express();

app.use(bodyParser.json());

app.get('/getallusers', (req, res) => {
    UserService.getAllUsers(req, res);
});

app.post('/adduser', (req, res) => {
    UserService.addUser(req, res);
});

app.put('/edituser/:id', (req, res) => {
    UserService.editUser(req, res);
});

app.delete('/deleteuser/:id', (req, res) => {
    UserService.deleteUser(req, res);
});

app.get('/getuser/:id', (req, res) => {
    UserService.getUser(req, res);
});
app.post('/login', (req, res) => {
    AuthService.login(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
