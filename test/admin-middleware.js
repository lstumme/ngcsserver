const { expect, assert } = require('chai');
const sinon = require('sinon');
const adminServices = require('../services/adminservices');
const isadmin = require('../middleware/is-admin');
const istoolmanager = require('../middleware/is-toolmanager');

describe('admin middleware', function (done) {
    describe('#isAdmin function', function (done) {
        beforeEach(function () {
            sinon.stub(adminServices, 'isAdmin');
        });

        afterEach(function () {
            adminServices.isAdmin.restore();
        });

        it('should call next(err) if user is not admin', function (done) {
            adminServices.isAdmin.returns(new Promise((resolve, reject) => {
                resolve(false);
            }));
            const req = {
                auth: { userId: 'abc' }
            }
            isadmin(req, {}, (err) => {
                expect(err).not.to.be.null;
                expect(err).to.have.property('message', 'Unauthorized');
                expect(err).to.have.property('statusCode', 401);
                done();
            })
                .then(() => {
                    assert.fail('Unknown Error');
                })
                .catch(err => {
                    assert.fail('Error : error thrown')
                });
        });

        it('should call next if user is admin', function (done) {
            adminServices.isAdmin.returns(new Promise((resolve, reject) => {
                resolve(true);
            }));
            const req = {
                auth: { userId: 'abc' }
            }
            isadmin(req, {}, () => {
                done();
            })
                .then(result => {
                    if (result) {    // Shoudl return nothing
                        assert.fail('Unknown Error');
                    }
                })
                .catch(err => {
                    assert.fail(err.toString());
                });
        });
    });

    describe('#isToolManager function', function (done) {
        beforeEach(function () {
            sinon.stub(adminServices, 'isToolManager');
        });

        afterEach(function () {
            adminServices.isToolManager.restore();
        });

        it('should call next(err) if user is not toolmanager', function (done) {
            adminServices.isToolManager.returns(new Promise((resolve, reject) => {
                resolve(false);
            }));
            const req = {
                auth: { userId: 'abc' }
            }
            istoolmanager(req, {}, (err) => {
                expect(err).not.to.be.null;
                expect(err).to.have.property('message', 'Unauthorized');
                expect(err).to.have.property('statusCode', 401);
                done();
            })
                .then(() => {
                    assert.fail('Unknown Error');
                })
                .catch(err => {
                    assert.fail('Error : error thrown')
                });
        });

        it('should call next if user is toolmanager', function (done) {
            adminServices.isToolManager.returns(new Promise((resolve, reject) => {
                resolve(true);
            }));
            const req = {
                auth: { userId: 'abc' }
            }
            istoolmanager(req, {}, () => {
                done();
            })
                .then(result => {
                    if (result) {    // Shoudl return nothing
                        assert.fail('Unknown Error');
                    }
                })
                .catch(err => {
                    assert.fail(err.toString());
                });
        });
    });
});