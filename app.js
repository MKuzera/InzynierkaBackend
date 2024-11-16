const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');
const ConferenceService = require('./services/ConferencesService');
const app = express();

app.use(bodyParser.json());

// Endpoints dla użytkowników
app.get('/getallusers', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.getAllUsers(req, res);
});

app.post('/adduser', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.addUser(req, res);
});

app.put('/edituser/:id', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.editUser(req, res);
});

app.delete('/deleteuser/:id', AuthService.verifyToken, AuthService.isAdmin, (req, res) => {
    UserService.deleteUser(req, res);
});

app.get('/getuser/:id', AuthService.verifyToken, (req, res) => {
    UserService.getUser(req, res);
});

app.post('/login', (req, res) => {
    AuthService.login(req, res);
});

// Endpoints dla konferencji
app.get('/conferences', AuthService.verifyToken, AuthService.isCreatorOrAdmin, (req, res) => {
    ConferenceService.getAllConferences(req, res);
});

app.post('/conferences', AuthService.verifyToken, AuthService.isCreatorOrAdmin, (req, res) => {
    ConferenceService.addConference(req, res);
});

app.put('/conferences/:id', AuthService.verifyToken, AuthService.isCreatorOrAdmin, (req, res) => {
    ConferenceService.editConference(req, res);
});

app.delete('/conferences/:id', AuthService.verifyToken, AuthService.isCreatorOrAdmin, (req, res) => {
    ConferenceService.deleteConference(req, res);
});

app.get('/conferences/:id', AuthService.verifyToken, AuthService.isCreatorOrAdmin, (req, res) => {
    ConferenceService.getConference(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
