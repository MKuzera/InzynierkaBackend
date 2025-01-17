const sinon = require('sinon');
const UserService = require('../services/UserService');
const DatabaseService = require('../services/DataBaseService');

describe('UserService.validateUserType', () => {
    it('should return true for valid types', () => {
        expect(UserService.validateUserType('admin')).toBe(true);
        expect(UserService.validateUserType('creator')).toBe(true);
        expect(UserService.validateUserType('user')).toBe(true);
    });

    it('should return false for invalid types', () => {
        expect(UserService.validateUserType('invalid')).toBe(false);
    });
});

describe('UserService.getAllUsers', () => {
    let dbStub;

    beforeEach(() => {
        // Create a mock for `getConnection` and `query` methods
        dbStub = sinon.stub(DatabaseService.prototype, 'getConnection').returns({
            query: sinon.stub(),
        });
    });

    afterEach(() => {
        sinon.restore(); // Restore the original functionality after each test
    });

    it('should fetch all users successfully', (done) => {
        const mockUsers = [
            { id: 1, username: 'user1', email: 'user1@example.com', type: 'admin' },
            { id: 2, username: 'user2', email: 'user2@example.com', type: 'user' },
        ];

        const mockRes = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
        };

        // Simulate a successful database query
        dbStub().query.callsFake((query, callback) => {
            expect(query).toEqual('SELECT * FROM users');
            callback(null, mockUsers);  // Simulating database response
        });

        UserService.getAllUsers({}, mockRes);

        setImmediate(() => {
            expect(mockRes.json.calledWith(mockUsers)).toBe(true);
            done();
        });
    });

    it('should handle error when fetching users', (done) => {
        const mockRes = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis(),
        };

        // Simulate a database error
        dbStub().query.callsFake((query, callback) => {
            callback(new Error('Database error'));
        });

        UserService.getAllUsers({}, mockRes);

        setImmediate(() => {
            expect(mockRes.status.calledWith(500)).toBe(true);
            expect(mockRes.json.calledWith({ message: 'Error fetching users' })).toBe(true);
            done();
        });
    });
});
