const UserService = require('../services/UserService');

class UserController {
    static addUserTest() {
        return new Promise((resolve, reject) => {
            UserService.addUserQuery("TEST", "TEST", "TEST", "user", (err, result) => {
                if (err) {
                    return reject(false); // Jeśli wystąpił błąd, odrzuć promise
                }

                // Teraz sprawdzamy, czy użytkownik został dodany
                UserService.getAllUsersQuery((err, users) => {
                    if (err) {
                        return reject(false); // Jeśli wystąpił błąd, odrzuć promise
                    }

                    const userExists = users.some(user => user.username === "TEST" && user.email === "TEST");
                    resolve(userExists); // Jeśli użytkownik został znaleziony, rozwiąż promise z wartością true/false
                });
            });
        });
    }
}

module.exports = UserController;
