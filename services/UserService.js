// const DatabaseService = require('./DatabaseService');
// const dbService = new DatabaseService();
//
// class UserService {
//     static getAllUsers(req, res) {
//         const query = 'SELECT * FROM users';
//         const db = dbService.getConnection();
//
//         db.query(query, (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Error fetching users' });
//             }
//             res.json(results);
//         });
//     }
// }
//
// module.exports = UserService;
