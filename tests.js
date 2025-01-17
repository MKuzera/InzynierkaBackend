require('dotenv').config();
const UserService = require('./services/UserService');
const DocumentService = require('./services/DocumentService');
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
    console.log("Wynik testu testAddDocument:", testAddDocumentResult);
}

runTests();
