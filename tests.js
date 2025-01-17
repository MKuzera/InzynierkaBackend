const UserService = require('./services/UserService');  // Załaduj UserService
require('dotenv').config();
class Tests {
    static async runTests() {
        try {
            // Testowanie metody addUserQuery
            const username = "testuser";
            const password = "password";
            const email = "test@example.com";
            const type = "user";

            // Wywołanie metody addUserQuery bez tworzenia instancji
            UserService.addUserQuery(username, password, email, type, (err, result) => {
                if (err) {
                    console.error("Error adding user:", err.message);
                } else {
                    console.log("User added:", result);
                }
            });

            // Testowanie metody getAllUsersQuery
            UserService.getAllUsersQuery((err, users) => {
                if (err) {
                    console.error("Error fetching users:", err.message);
                } else {
                    console.log("Users:", users);
                }
            });

        } catch (error) {
            console.error("Error running tests:", error);
        }
    }
}

// Uruchom testy
Tests.runTests();
