const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const UserService = require('../services/UserService');
const DatabaseService = require('../services/DataBaseService');
const app = require('../app');

chai.use(chaiHttp);
const { expect } = chai;

describe('UserService', function() {
    let dbMock;

    beforeEach(() => {
        dbMock = sinon.stub(DatabaseService.prototype, 'getConnection').returns({
            query: (query, values, callback) => {
                if (query === 'SELECT * FROM users') {
                    callback(null, [{ id: 1, username: 'testUser', type: 'admin' }]);
                } else if (query.startsWith('INSERT INTO users')) {
                    callback(null, { insertId: 1 });
                } else if (query.startsWith('UPDATE users')) {
                    callback(null, { affectedRows: 1 });
                } else if (query.startsWith('DELETE FROM users')) {
                    callback(null, { affectedRows: 1 });
                } else if (query.startsWith('SELECT * FROM users WHERE id = ?')) {
                    callback(null, [{ id: 1, username: 'testUser', type: 'admin' }]);
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('validateUserType', function() {
        it('should return true for valid user types', function() {
            expect(UserService.validateUserType('admin')).to.be.true;
            expect(UserService.validateUserType('creator')).to.be.true;
            expect(UserService.validateUserType('user')).to.be.true;
        });

        it('should return false for invalid user type', function() {
            expect(UserService.validateUserType('guest')).to.be.false;
        });
    });

    describe('getAllUsers', function() {
        it('should return a list of users', function(done) {
            chai.request(app)
                .get('/getallusers')
                .set('Authorization', 'Bearer token')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('id');
                    expect(res.body[0]).to.have.property('username');
                    done();
                });
        });
    });

    describe('addUser', function() {
        it('should add a user successfully', function(done) {
            const user = {
                username: 'newUser',
                password: 'password123',
                email: 'newuser@example.com',
                type: 'user'
            };

            chai.request(app)
                .post('/adduser')
                .set('Authorization', 'Bearer token')
                .send(user)
                .end((err, res) => {
                    expect(res.status).to.equal(201);
                    expect(res.body.message).to.equal('User added successfully');
                    done();
                });
        });

        it('should return an error for invalid user type', function(done) {
            const user = {
                username: 'newUser',
                password: 'password123',
                email: 'newuser@example.com',
                type: 'invalidType'
            };

            chai.request(app)
                .post('/adduser')
                .set('Authorization', 'Bearer token')
                .send(user)
                .end((err, res) => {
                    expect(res.status).to.equal(400);
                    expect(res.body.message).to.equal('Invalid user type. Allowed values: admin, creator, user');
                    done();
                });
        });
    });

    describe('editUser', function() {
        it('should update the user successfully', function(done) {
            const updatedUser = {
                username: 'updatedUser',
                password: 'newpassword123',
                email: 'updateduser@example.com',
                type: 'creator'
            };

            chai.request(app)
                .put('/edituser/1')
                .set('Authorization', 'Bearer token')
                .send(updatedUser)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.message).to.equal('User updated successfully');
                    done();
                });
        });

        it('should return an error when user not found', function(done) {
            chai.request(app)
                .put('/edituser/999')
                .set('Authorization', 'Bearer token')
                .send({
                    username: 'updatedUser',
                    password: 'newpassword123',
                    email: 'updateduser@example.com',
                    type: 'creator'
                })
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal('User not found');
                    done();
                });
        });
    });

    describe('deleteUser', function() {
        it('should delete the user successfully', function(done) {
            chai.request(app)
                .delete('/deleteuser/1')
                .set('Authorization', 'Bearer token')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.message).to.equal('User deleted successfully');
                    done();
                });
        });

        it('should return an error when user not found', function(done) {
            chai.request(app)
                .delete('/deleteuser/999')
                .set('Authorization', 'Bearer token')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal('User not found');
                    done();
                });
        });
    });

    describe('getUser', function() {
        it('should return a user by ID', function(done) {
            chai.request(app)
                .get('/getuser/1')
                .set('Authorization', 'Bearer token')
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('username');
                    done();
                });
        });

        it('should return an error when user not found', function(done) {
            chai.request(app)
                .get('/getuser/999')
                .set('Authorization', 'Bearer token')
                .end((err, res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.message).to.equal('User not found');
                    done();
                });
        });
    });
});
