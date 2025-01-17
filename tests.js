require('dotenv').config();
const UserService = require('./services/UserService');

class Tests {
    static async runTests() {
        try {
            const username = "testuser";
            const password = "password";
            const email = "test@example.com";
            const type = "user";

            UserService.addUserQuery(username, password, email, type, (err, result) => {
                if (err) {
                    console.error("Error adding user:", err.message);
                    return;
                }

                console.log("User added:", result);

                UserService.getUserQuery(result.userId, (err, user) => {
                    if (err) {
                        console.error("Error fetching user:", err.message);
                        return;
                    }

                    if (user.username === username && user.email === email && user.type === type) {
                        console.log("User exists:", true);
                    } else {
                        console.log("User exists:", false);
                    }
                });
            });

        } catch (error) {
            console.error("Error running tests:", error);
        }
    }
}

Tests.runTests();
