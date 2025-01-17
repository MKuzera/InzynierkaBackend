const UserService = require('../services/UserService');

class UserController {
    static addUserTest() {
        UserService.addUserQuery("TEST", "TEST", "TEST", "user", (err, result) => {
            if (err) {
                return false;
            }
            UserService.getAllUsersQuery((err, users) => {
                if (err) {
                    return false;
                }
                const userExists = users.some(user => user.username === "TEST" && user.email === "TEST");
                return userExists;
            });
        });
    }
}

module.exports = UserController;
