const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const UserService = require('./services/UserService');
const AuthService = require('./services/AuthService');
const ConferenceService = require('./services/ConferencesService');
const app = express();

app.use(bodyParser.json());
const DocumentService = require('./services/DocumentService');
const cors = require("cors");


const allowedOrigins = [
    'http://3.72.222.19:3000',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.get('/documents', AuthService.verifyToken, (req, res) => {
    DocumentService.getAllDocuments(req, res);
});

app.get('/documents/:id', AuthService.verifyToken, (req, res) => {
    DocumentService.getDocument(req, res);
});

app.get('/documents/author/:authorId', AuthService.verifyToken, (req, res) => {
    DocumentService.getAllDocumentsForAuthor(req, res);
});

app.post('/documents', AuthService.verifyToken, (req, res) => {
    DocumentService.addDocument(req, res);
});

app.put('/documents/:id', AuthService.verifyToken, (req, res) => {
    DocumentService.editDocument(req, res);
});

app.delete('/documents/:id', AuthService.verifyToken, (req, res) => {
    DocumentService.deleteDocument(req, res);
});
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
app.get('/conferences/author/:authorId', AuthService.verifyToken, (req, res) => {
    ConferenceService.getAllConferencesForOrganizer(req, res);
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
