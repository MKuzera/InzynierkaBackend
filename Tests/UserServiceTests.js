import * as chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';
import UserService from '../services/UserService.js';
import DatabaseService from '../services/DataBaseService.js';




describe('UserService', () => {
    let dbServiceStub;
    let dbStub;

    beforeEach(() => {
        // Create a stub for the DatabaseService
        dbServiceStub = sinon.createStubInstance(DatabaseService);

        // Mock the getConnection method to return a stubbed connection
        dbStub = { query: sinon.stub() }; // Mock query method
        dbServiceStub.getConnection.returns(dbStub); // Make getConnection return our stub

        // You can also use sinon.stub(DatabaseService.prototype, 'getConnection') if you need to mock this at the prototype level
    });

    afterEach(() => {
        sinon.restore(); // Restore all the stubs after each test
    });

    describe('getAllUsers', () => {
        it('should return all users', (done) => {
            const mockUsers = [{ id: 1, username: 'john' }, { id: 2, username: 'jane' }];

            // Mock the query method to simulate a successful response
            dbStub.query.callsArgWith(1, null, mockUsers); // 1st argument is error (null means no error), 2nd is results

            const req = {};
            const res = { json: sinon.spy() };

            // Call the method
            UserService.getAllUsers(req, res);

            // Validate that query was called and response was sent
            expect(dbStub.query.calledOnce).to.be.true;
            expect(res.json.calledWith(mockUsers)).to.be.true;
            done();
        });

        it('should return an error if there is an issue fetching users', (done) => {
            const errorMessage = 'Error fetching users';

            // Mock the query method to simulate an error
            dbStub.query.callsArgWith(1, new Error(errorMessage));

            const req = {};
            const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

            UserService.getAllUsers(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ message: errorMessage })).to.be.true;
            done();
        });
    });

    // You can add similar tests for other methods like addUser, editUser, etc.
});
