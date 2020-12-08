const { expect, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { RoleServices } = require('ngcsroles');
const inittoolsdb = require('../config/inittoolsdb');

describe('Tools Database Initialization', function () {
    before(async () => {
        await dbHandler.connect();
    });

    after(async () => {
        await dbHandler.closeDatabase();
    });

    afterEach(async () => {
        await dbHandler.clearDatabase();
    });

    it('should throw an error if administrators role not found', function (done) {
        inittoolsdb()
            .then(result => {
                console.log("result : " + result)
                assert.fail();
            })
            .catch(err => {
                expect(err).to.have.property('message', 'administrators role not found');
                done();
            })
    });

    it('should create a toolsmanager role and add it as subRole to admins ', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
            .then(admins => {
                inittoolsdb()
                    .then(result => {
                        RoleServices.findRoleByName({ name: 'toolsmanagers' })
                            .then(tools => {
                                expect(tools).not.to.be.null;
                                expect(tools).not.to.be.undefined;
                                return tools;
                            })
                            .then(users => {
                                return RoleServices.findRoleByName({ name: 'administrators' })
                                    .then(newAdmins => {
                                        expect(newAdmins.subRoles).to.include(users.roleId);
                                        return users;
                                    })
                            })
                            .then(users => {
                                done();
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        assert(fail);
                    })
            })
    });


    it('should add users as subRole of administrators', function (done) {
        RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
            .then(users => {
                RoleServices.createRole({ name: 'administrators', label: 'administrators' })
                    .then(admins => {
                        inittoolsdb()
                            .then(() => {
                                RoleServices.findRoleByName({ name: 'administrators' })
                                    .then(newAdmins => {
                                        expect(newAdmins.subRoles).includes(users.roleId);
                                        done();
                                    })
                            })
                    });
            })
            .catch(err => {
                console.log(err);
                assert.fail(err);
                done();
            })
    });

    it('should not change anything if everything is in order', function (done) {
        RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
            .then(toolRole => {
                RoleServices.createRole({ name: 'administrators', label: 'administrators' })
                    .then(adminRole => {
                        RoleServices.addSubRoleToRole({ roleId: adminRole.roleId, subRoleId: toolRole.roleId })
                            .then(() => {
                                inittoolsdb()
                                    .then(() => {
                                        RoleServices.findRoleByName({ name: 'administrators' })
                                            .then(newAdmins => {
                                                expect(newAdmins.subRoles).includes(toolRole.roleId);
                                                done();
                                            })
                                    })
                            })
                    });
            })
            .catch(err => {
                console.log(err);
                assert.fail(err);
                done();
            })
    });
});
