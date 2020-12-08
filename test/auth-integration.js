const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { dbHandler } = require('ngcstesthelpers');
const { UserServices } = require('ngcsusers');
const authcontroller = require('../controllers/authcontroller');
const isauth = require('../middleware/is-auth');
const { RoleServices } = require('ngcsroles');

describe('Auth Integration', function () {
    describe('#login function', function () {
        let registeredUser, userRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            sinon.stub(jwt, 'sign');
            sinon.stub(bcrypt, 'compare');
            userRole = await RoleServices.createRole({ name: 'role', label: 'roleLabel' });
            registeredUser = await UserServices.createUser({
                login: 'registeredUser',
                password: 'password',
                email: 'user@user.com',
                role: userRole.roleId
            });
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
            jwt.sign.restore();
            bcrypt.compare.restore();
        });

        it('should return signin objet response ', function (done) {
            const req = {
                body: {
                    login: registeredUser.login,
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
            bcrypt.compare.returns(new Promise((resolve, reject) => {
                return resolve(true);
            }));
            jwt.sign.returns('encryptedToken');
            authcontroller.login(req, res, () => { }).then(result => {
                expect(res).to.have.property('statusCode', 200);
                expect(res.jsonObject).to.have.property('message', 'Access granted');
                expect(res.jsonObject.data).to.have.property('userId', registeredUser.userId);
                expect(res.jsonObject.data).to.have.property('token', 'encryptedToken');
                done();
            })
        });


    });

    describe('#isAuth function', function () {
        beforeEach(function () {
            sinon.stub(jwt, 'verify');
        });

        afterEach(function () {
            jwt.verify.restore();
        });

        it('should call decodetoken and put userId in req', function () {
            const req = {
                get: function (headerName) {
                    if (headerName === 'Authorization') {
                        return 'Bearer xyz';
                    }
                }
            }
            jwt.verify.returns({ userId: 'abc', otherParameters: 'otherParameters' });
            isauth(req, {}, () => { });
            expect(req).to.have.property('auth');
            expect(req.auth).to.have.property('userId', 'abc');
        });
    });

});