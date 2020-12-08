const { expect, assert } = require('chai');
const sinon = require('sinon');

const authcontroller = require('../controllers/authcontroller');
const authServices = require('../services/authservices');

describe('Auth Controller', function () {
    describe('#login function', function () {
        beforeEach(function () {
            sinon.stub(authServices, 'signin');
        });

        afterEach(function () {
            authServices.signin.restore();
        });

        it('should call next(err) if login is not specified', function (done) {
            const req = {
                body: {
                    password: 'password'
                }
            }
            authcontroller.login(req, {}, (err) => {
                expect(err).not.to.be.null;
                expect(err).to.have.property('statusCode', 400);
                expect(err).to.have.property('message', 'Bad arguments.');
                done();
            })
                .then(response => {
                    assert.fail('login error');
                })
                .catch(err => {
                    assert.fail('Error thrown')
                });
        });

        it('should throw an error if login is not specified', function (done) {
            const req = {
                body: {
                    login: 'login'
                }
            }
            authcontroller.login(req, {}, (err) => {
                expect(err).not.to.be.null;
                expect(err).to.have.property('statusCode', 400);
                expect(err).to.have.property('message', 'Bad arguments.');
                done();
            })
                .then(response => {
                    assert.fail('login error');
                })
                .catch(err => {
                    assert.fail('Error thrown')
                });
        });

        it('should return signin objet response ', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
                }
            };
            const res = {
                statusCode: 0,
                jsonObject: {},
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (value) {
                    this.jsonObject = value;
                    return this;
                }
            };
            authServices.signin.returns(new Promise((resolve, reject) => {
                resolve({ token: 'tokenValue', userId: 'userIdValue' });
            }));
            authcontroller.login(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'Access granted');
                expect(res.jsonObject.data).to.have.property('userId', 'userIdValue');
                expect(res.jsonObject.data).to.have.property('token', 'tokenValue');
                done();
            });
        });

        it('should call next(err) adding default statusCode on process error', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
                }
            };
            authServices.signin.returns(new Promise((resolve, reject) => {
                throw new Error('Undefined Error');
            }));

            authcontroller.login(req, {}, (err) => {
                expect(err).to.not.be.null;
                expect(err).to.have.property('statusCode', 500);
                done();
            }).then(result => {
                assert.fail('Next not called');
            }).catch(err => {
                assert.fail('Error thrown');
            });
        });

        it('should call next(err) keeping specified statusCode', function (done) {
            const req = {
                body: {
                    login: 'userlogin',
                    password: 'password'
                }
            };
            authServices.signin.returns(new Promise((resolve, reject) => {
                const error = new Error('Undefined Error');
                error.statusCode = 400;
                throw error;
            }));
            authcontroller.login(req, {}, (err) => {
                expect(err).to.not.be.null;
                expect(err).to.have.property('statusCode', 400);
                done();
            }).then(result => {
                assert.fail('Next not called');
            }).catch(err => {
                assert.fail('Error thrown');
            });
        });
    });
});