const { expect, assert } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { dbHandler } = require('ngcstesthelpers');

const { decodeToken } = require('../services/authservices');
const authServices = require('../services/authservices');
const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');

describe('Auth Services', function () {
    describe('#decodeToken', function () {
        beforeEach(function () {
            sinon.stub(jwt, 'verify');
        });

        afterEach(function () {
            jwt.verify.restore();
        });

        it('should throw an error if no token specified', function () {
            // expect(decodeToken.bind(this, {})).to.be.an('error').to.have.property('statusCode', 400);
            let error = null;
            try {
                decodeToken({});
            } catch (err) {
                error = err;
            }
            expect(error).to.not.be.null;
            expect(error).to.have.property('statusCode', 400);
        });

        it('should throw an error if token decoding failed', function () {
            jwt.verify.returns(null);
            let error;
            try {
                decodeToken({ token: 'token' });
            } catch (err) {
                error = err;
            }
            expect(error).to.not.be.null;
            expect(error).to.have.property('statusCode', 401);
        });

        it('should throw an error if decoding process failed', function () {
            jwt.verify.throws();
            let error;
            try {
                decodeToken({ token: 'token' });
            } catch (err) {
                error = err;
            }
            expect(error).to.not.be.null;
            expect(error).to.have.property('statusCode', 500);
        });

        it('should return a userId if decoding process succeed', function () {
            jwt.verify.returns({ userId: 'abc', otherParameters: 'otherParameters' });
            const result = decodeToken({ token: 'token' });
            expect(result).to.have.property('userId', 'abc');
        });
    });

    describe('#signin function', function () {
        let defaultRole, registeredUser;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            sinon.stub(jwt, 'sign');
            sinon.stub(bcrypt, 'compare');
            defaultRole = await RoleServices.createRole({
                name: 'defaultRole',
                label: 'defaultLabel'
            });

            registeredUser = await UserServices.createUser({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: defaultRole.roleId
            });
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
            jwt.sign.restore();
            bcrypt.compare.restore();
        });

        it('should throw an error if User not found', function (done) {
            const params = { login: 'unknownUser', password: 'password' };
            authServices.signin(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'User not found');
                    expect(err).to.have.property('statusCode', 401);
                    done();
                })
        });

        it('should throw an error if password is incorect', function (done) {
            const params = { login: 'registeredUser', passowrd: 'wrongPassword' };
            bcrypt.compare.returns(new Promise((resolve, reject) => {
                return resolve(false);
            }));
            authServices.signin(params)
                .then(result => {
                    assert.fail('Error');
                    done();
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Wrong password');
                    expect(err).to.have.property('statusCode', 401);
                    done();
                })
        });

        it('should return token and userId if succeed', function (done) {
            const params = { login: 'registeredUser', passowrd: 'password' };
            bcrypt.compare.returns(new Promise((resolve, reject) => {
                return resolve(true);
            }));
            jwt.sign.returns('encryptedToken');
            authServices.signin(params)
                .then(result => {
                    expect(result).to.have.property('token', 'encryptedToken');
                    expect(result).to.have.property('userId');
                    done();
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
                });
        });
    });
});
