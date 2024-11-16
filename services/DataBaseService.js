// const mysql = require('mysql2');
//
// class DatabaseService {
//     constructor() {
//         if (!DatabaseService.instance) {
//             this.connection = mysql.createConnection({
//                 host: process.env.DB_HOST,
//                 user: process.env.DB_USER,
//                 password: process.env.DB_PASSWORD,
//                 database: process.env.DB_NAME,
//             });
//
//             this.connection.connect((err) => {
//                 if (err) {
//                     console.error('Error connecting to the database:', err);
//                     throw err;
//                 }
//                 console.log('Database connection established successfully.');
//             });
//
//             DatabaseService.instance = this;
//         }
//         return DatabaseService.instance;
//     }
//
//     getConnection() {
//         return this.connection;
//     }
//
//     closeConnection() {
//         this.connection.end((err) => {
//             if (err) {
//                 console.error('Error closing the database connection:', err);
//             } else {
//                 console.log('Database connection closed.');
//             }
//         });
//     }
// }
//
// module.exports = DatabaseService;