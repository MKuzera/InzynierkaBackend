// const jwt = require('jsonwebtoken');
// const DatabaseService = require('./DatabaseService');
// const dbService = new DatabaseService();
//
// class AuthService {
//     static login(req, res) {
//         const authHeader = req.headers['authorization'];
//         if (!authHeader) {
//             return res.status(401).json({ message: 'Authorization header missing' });
//         }
//
//         const [login, password] = Buffer.from(authHeader.split(' ')[1], 'base64')
//             .toString('ascii')
//             .split(':');
//
//         const query = 'SELECT id, userType FROM users WHERE login = ? AND password = ?';
//         const db = dbService.getConnection();
//
//         db.query(query, [login, password], (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Internal server error' });
//             }
//
//             if (results.length === 0) {
//                 return res.status(401).json({ message: 'Invalid login or password' });
//             }
//
//             const user = results[0];
//             const token = jwt.sign(
//                 { userId: user.id, userType: user.userType },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '1h' }
//             );
//
//             return res.status(200).json({
//                 message: 'Login successful',
//                 userType: user.userType,
//                 token: token,
//             });
//         });
//     }
//
//     static about(req, res) {
//         res.send('About birds');
//     }
// }
//
// module.exports = AuthService;
