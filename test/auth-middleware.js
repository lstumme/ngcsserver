const { expect } = require('chai');
const sinon = require('sinon');
const isauth = require('../middleware/is-auth');
const authServices = require('../services/authservices');


describe('Auth Middleware', function () {
    it('should call next(err) if authentification is not defined', function () {
        const req = {
            get: function (headerName) {
                return null;
            }
        }
        isauth(req, {}, (err) => {
            expect(err).not.to.be.null;
            expect(err).to.have.property('message', 'Not authenticated.')
        })
    });

    it('should throw an error if authentification is not well formed', function () {
        const req = {
            get: function (headerName) {
                if (headerName === 'Authorization') {
                    return 'xyz';
                } else {
                    return 'a xyz';
                }
            }
        }
        isauth(req, {}, (err) => {
            expect(err).not.to.be.null;
            expect(err).to.have.property('message', 'Bad arguments.')
        })
    });

    it('should call decodetoken and put userId in req', function () {
        const req = {
            get: function (headerName) {
                if (headerName === 'Authorization') {
                    return 'Bearer xyz';
                }
            }
        }
        sinon.stub(authServices, 'decodeToken');
        authServices.decodeToken.returns({ userId: 'abc' });
        let nextCalled = false;
        isauth(req, {}, (err) => {
            expect(err).to.be.undefined;
            nextCalled = true;
        });
        expect(authServices.decodeToken.called).to.be.true;
        expect(nextCalled).to.be.true;
        expect(req).to.have.property('auth');
        expect(req.auth).to.have.property('userId', 'abc');
        authServices.decodeToken.restore();
    });
});
