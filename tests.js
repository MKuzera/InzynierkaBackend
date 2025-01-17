const UserController = require('./Tests/UserControllerQueryTests');

UserController.addUserTest()
    .then(result => {
        console.log(result); // Zwróci true lub false, w zależności od wyniku
    })
    .catch(err => {
        console.log(err); // Obsłuży błąd, jeśli wystąpi
    });