require('dotenv').config();
const UserService = require('./services/UserService');

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
}

async function runTests() {
    const addUserResult = await Tests.testAddUser();
    console.log("Wynik testu AddUser:", addUserResult);

    const addAndRemoveUserResult = await Tests.testAddAndRemoveUser();
    console.log("Wynik testu AddAndRemoveUser:", addAndRemoveUserResult);
}

runTests();
