require('dotenv').config();
const UserService = require('./services/UserService');
const DocumentService = require('./services/DocumentService');
const ConferenceService = require('./services/ConferencesService');
class Tests {
    static async testAddUser() {
        const username = "testuser_add";
        const password = "password";
        const email = "test@example.com";
        const type = "user";

        return new Promise((resolve) => {
            UserService.addUserQuery(username, password, email, type, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                UserService.getUserQuery(result.userId, (err, user) => {
                    if (err || !user || user.username !== username || user.email !== email || user.type !== type) {
                        resolve(false);
                    } else {
                        UserService.deleteUserQuery(result.userId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            });
        });
    }

    static async testAddAndRemoveUser() {
        const username = "testuser_remove";
        const password = "password";
        const email = "test@example.com";
        const type = "user";

        return new Promise((resolve) => {
            UserService.addUserQuery(username, password, email, type, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                UserService.getUserQuery(result.userId, (err, user) => {
                    if (err || !user || user.username !== username || user.email !== email || user.type !== type) {
                        resolve(false);
                        return;
                    }

                    UserService.deleteUserQuery(result.userId, (err) => {
                        if (err) {
                            resolve(false);
                            return;
                        }

                        UserService.getUserQuery(result.userId, (err, user) => {
                            if (user) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    });
                });
            });
        });
    }

    static async testEditUser() {
        const username = "testuser_edit";
        const password = "password";
        const email = "test@example.com";
        const type = "user";
        const newUsername = "testuser_edit_changed";

        return new Promise((resolve) => {
            UserService.addUserQuery(username, password, email, type, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                UserService.editUserQuery(result.userId, newUsername, password, email, type, (err, updatedUser) => {
                    if (err) {
                        resolve(false);
                        return;
                    }

                    UserService.getUserQuery(result.userId, (err, user) => {
                        if (err || !user || user.username !== newUsername) {
                            resolve(false);
                            return;
                        }

                        UserService.deleteUserQuery(result.userId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    });
                });
            });
        });
    }

    static async testGetUser() {
        const username = "testuser_get";
        const password = "password";
        const email = "test@example.com";
        const type = "user";

        return new Promise((resolve) => {
            UserService.addUserQuery(username, password, email, type, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                UserService.getUserQuery(result.userId, (err, user) => {
                    if (err || !user || user.username !== username || user.email !== email || user.type !== type) {
                        resolve(false);
                    } else {
                        UserService.deleteUserQuery(result.userId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            });
        });
    }

    static async testGetAllUsers() {
        return new Promise((resolve) => {
            UserService.getAllUsersQuery((err, users) => {
                if (err || !users || users.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static async testAddDocument() {
        const title = "Test Document";
        const author = "Test Author";
        const authorId = 1;
        const description = "Test Description";
        const tags = "test, sample";
        const dateAdded = new Date().toISOString();
        const link = "http://example.com/document";

        return new Promise((resolve) => {
            DocumentService.addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                DocumentService.getDocumentQuery(result.documentId, (err, document) => {
                    if (err || !document || document.title !== title || document.author !== author || document.authorId !== authorId || document.description !== description || document.tags !== tags || document.link !== link) {
                        resolve(false);
                    } else {
                        DocumentService.deleteDocumentQuery(result.documentId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            });
        });
    }
    static async testEditDocument() {
        const title = "Test Document";
        const author = "Test Author";
        const authorId = 1;
        const description = "Test Description";
        const tags = "test, sample";
        const dateAdded = new Date().toISOString();
        const link = "http://example.com/document";

        return new Promise((resolve) => {
            DocumentService.addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                const newTitle = "Updated Document Title";
                DocumentService.editDocumentQuery(result.documentId, newTitle, author, authorId, description, tags, dateAdded, link, (err, updatedResult) => {
                    if (err) {
                        resolve(false);
                        return;
                    }

                    DocumentService.getDocumentQuery(result.documentId, (err, document) => {
                        if (err || !document || document.title !== newTitle) {
                            resolve(false);
                        } else {
                            DocumentService.deleteDocumentQuery(result.documentId, (err) => {
                                if (err) {
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            });
                        }
                    });
                });
            });
        });
    }

    static async testRemoveDocument() {
        const title = "Test Document";
        const author = "Test Author";
        const authorId = 1;
        const description = "Test Description";
        const tags = "test, sample";
        const dateAdded = new Date().toISOString();
        const link = "http://example.com/document";

        return new Promise((resolve) => {
            DocumentService.addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                DocumentService.deleteDocumentQuery(result.documentId, (err) => {
                    if (err) {
                        resolve(false);
                        return;
                    }

                    DocumentService.getDocumentQuery(result.documentId, (err, document) => {
                        if (document) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        });
    }
    static async testGetDocument() {
        const title = "Test Document";
        const author = "Test Author";
        const authorId = 1;
        const description = "Test Description";
        const tags = "test, sample";
        const dateAdded = new Date().toISOString();
        const link = "http://example.com/document";

        return new Promise((resolve) => {
            DocumentService.addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                DocumentService.getDocumentQuery(result.documentId, (err, document) => {
                    if (err || !document || document.title !== title) {
                        resolve(false);
                    } else {
                        DocumentService.deleteDocumentQuery(result.documentId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            });
        });
    }

    static async testGetAllDocuments() {
        const title = "Test Document";
        const author = "Test Author";
        const authorId = 1;
        const description = "Test Description";
        const tags = "test, sample";
        const dateAdded = new Date().toISOString();
        const link = "http://example.com/document";

        return new Promise((resolve) => {
            DocumentService.addDocumentQuery(title, author, authorId, description, tags, dateAdded, link, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                DocumentService.getAllDocumentsQuery((err, documents) => {
                    if (err || !documents || documents.length === 0) {
                        resolve(false);
                    } else {
                        DocumentService.deleteDocumentQuery(result.documentId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            });
        });
    }

    static async testAddConference() {
        const title = "Test Conference";
        const description = "This is a test conference";
        const location = "Test Location";
        const organizers = "Organizer1, Organizer2";
        const tags = "Science, Technology";
        const price = 100;
        const date = "2025-01-01";
        const link = "https://testconference.com";
        const organizerID = 1;

        return new Promise((resolve) => {
            ConferenceService.addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                const conferenceId = result.insertId;
                ConferenceService.getConferenceQuery(conferenceId, (err, conference) => {
                    if (err || !conference || conference.title !== title || conference.description !== description || conference.location !== location || conference.tags !== tags) {
                        resolve(false);
                    } else {
                        ConferenceService.deleteConferenceQuery(conferenceId, (err) => {
                            if (err) {
                                resolve(false);
                            } else {
                                resolve(true);
                            }
                        });
                    }
                });
            });
        });
    }

    static async testEditConference() {
        const title = "Test Conference";
        const description = "This is a test conference";
        const location = "Test Location";
        const organizers = "Organizer1, Organizer2";
        const tags = "Science, Technology";
        const price = 100;
        const date = "2025-01-01";
        const link = "https://testconference.com";
        const organizerID = 1;

        return new Promise((resolve) => {
            ConferenceService.addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                const conferenceId = result.insertId;

                const updatedTitle = "Updated Conference Title";
                const updatedDescription = "Updated description";
                const updatedLocation = "Updated location";
                const updatedOrganizers = "Organizer1, Organizer2";
                const updatedTags = "Technology, Innovation";
                const updatedPrice = 150;
                const updatedDate = "2025-02-01";
                const updatedLink = "https://updatedconference.com";
                const updatedOrganizerID = 1;

                ConferenceService.editConferenceQuery(conferenceId, updatedTitle, updatedDescription, updatedLocation, updatedOrganizers, updatedTags, updatedPrice, updatedDate, updatedLink, updatedOrganizerID, (err, result) => {
                    if (err || result.affectedRows === 0) {
                        resolve(false);
                        return;
                    }

                    ConferenceService.getConferenceQuery(conferenceId, (err, conference) => {
                        if (err || !conference || conference.title !== updatedTitle || conference.description !== updatedDescription || conference.location !== updatedLocation || conference.tags !== updatedTags) {
                            resolve(false);
                        } else {
                            ConferenceService.deleteConferenceQuery(conferenceId, (err) => {
                                if (err) {
                                    resolve(false);
                                } else {
                                    resolve(true);
                                }
                            });
                        }
                    });
                });
            });
        });
    }

    static async testRemoveConference() {
        const title = "Test Conference";
        const description = "This is a test conference";
        const location = "Test Location";
        const organizers = "Organizer1, Organizer2";
        const tags = "Science, Technology";
        const price = 100;
        const date = "2025-01-01";
        const link = "https://testconference.com";
        const organizerID = 1;

        return new Promise((resolve) => {
            ConferenceService.addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID, (err,result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                const conferenceId = result.insertId;

                ConferenceService.deleteConferenceQuery(conferenceId, (err, result) => {
                    if (err || result.affectedRows === 0) {
                        resolve(false);
                        return;
                    }

                    ConferenceService.getConferenceQuery(conferenceId, (err, conference) => {
                        if (conference) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        });
    }

    static async testGetConference() {
        const title = "Test Conference";
        const description = "This is a test conference";
        const location = "Test Location";
        const organizers = "Organizer1, Organizer2";
        const tags = "Science, Technology";
        const price = 100;
        const date = "2025-01-01";
        const link = "https://testconference.com";
        const organizerID = 1;

        return new Promise((resolve) => {
            ConferenceService.addConferenceQuery(title, description, location, organizers, tags, price, date, link, organizerID, (err, result) => {
                if (err) {
                    resolve(false);
                    return;
                }

                const conferenceId = result.insertId;

                ConferenceService.getConferenceQuery(conferenceId, (err, conference) => {
                    if (err || !conference) {
                        resolve(false);
                        return;
                    }

                    ConferenceService.deleteConferenceQuery(conferenceId, (err) => {
                        if (err) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    });
                });
            });
        });
    }
}



async function runTests() {
    const addUserResult = await Tests.testAddUser();
    console.log("Wynik testu AddUser:", addUserResult);

    const addAndRemoveUserResult = await Tests.testAddAndRemoveUser();
    console.log("Wynik testu AddAndRemoveUser:", addAndRemoveUserResult);

    const editUserResult = await Tests.testEditUser();
    console.log("Wynik testu EditUser:", editUserResult);

    const getUserResult = await Tests.testGetUser();
    console.log("Wynik testu GetUser:", getUserResult);

    const getAllUsersResult = await Tests.testGetAllUsers();
    console.log("Wynik testu GetAllUsers:", getAllUsersResult);

    const testAddDocumentResult = await  Tests.testAddDocument();
    console.log("Wynik testu AddDocument:", testAddDocumentResult);

    const testEditDocumentResult = await Tests.testEditDocument();
    console.log("Wynik testu EditDocument:", testEditDocumentResult);

    const testRemoveDocumentResult = await  Tests.testRemoveDocument();
    console.log("Wynik testu RemoveDocument:", testRemoveDocumentResult);

    const testGetDocumentResult = await Tests.testGetDocument();
    console.log("Wynik testu GetDocument:", testGetDocumentResult);

    const testGetAllDocumentsResult = await Tests.testGetAllDocuments();
    console.log("Wynik testu GetAllDocuments:", testGetAllDocumentsResult);

    const testAddConferenceResult = await Tests.testAddConference();
    console.log("Wynik testu AddConference:", testAddConferenceResult);

    const testEditConferenceResult = await Tests.testEditConference();
    console.log("Wynik testu EditConference:", testEditConferenceResult);

    const testRemoveConferenceResult = await Tests.testRemoveConference();
    console.log("Wynik testu RemoveConference:", testRemoveConferenceResult);

    const testGetConferenceResult = await Tests.testGetConference();
    console.log("Wynik testu GetConference:", testGetConferenceResult);

}

runTests();
