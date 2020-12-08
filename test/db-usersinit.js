const { expect, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { RoleServices } = require('ngcsroles');
const initusersdb = require('../config/initusersdb');

describe('User Database Initialization', function () {
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
        initusersdb()
            .then(result => {
                console.log("result : " + result)
                assert.fail();
            })
            .catch(err => {
                expect(err).to.have.property('message', 'administrators role not found');
                done();
            })
    });

    it('should throw an error if toolsmanagers role not found', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
            .then(() => {
                initusersdb()
                    .then(result => {
                        console.log("result : " + result)
                        assert.fail();
                    })
                    .catch(err => {
                        expect(err).to.have.property('message', 'toolsmanagers role not found');
                        done();
                    })
            })
    });

    it('should create a user role and add it as subRole to admins and toolsmanager', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
            .then(() => {
                RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
                    .then(() => {
                        initusersdb()
                            .then(() => {
                                RoleServices.findRoleByName({ name: 'users' })
                                    .then(users => {
                                        expect(users).not.to.be.null;
                                        expect(users).not.to.be.undefined;
                                        return users;
                                    })
                                    .then(users => {
                                        return RoleServices.findRoleByName({ name: 'administrators' })
                                            .then(newAdmins => {
                                                expect(newAdmins.subRoles).includes(users.roleId);
                                                return users;
                                            })
                                    })
                                    .then(users => {
                                        return RoleServices.findRoleByName({ name: 'toolsmanagers' })
                                            .then(newTools => {
                                                expect(newTools.subRoles).includes(users.roleId);
                                                return users;
                                            })
                                    })
                                    .then(() => {
                                        done();
                                    })
                            })
                    })
            })
            .catch(err => {
                console.log(err);
                assert(fail);
            })
    });


    it('should add users as subRole of administrators', function (done) {
        RoleServices.createRole({ name: 'users', label: 'users' })
            .then(users => {
                RoleServices.createRole({ name: 'administrators', label: 'administrators' })
                    .then(() => {
                        RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
                            .then(tools => {
                                RoleServices.addSubRoleToRole({ roleId: tools.roleId, subRoleId: users.roleId })
                                    .then(r => {
                                        initusersdb()
                                            .then(() => {
                                                RoleServices.findRoleByName({ name: 'administrators' })
                                                    .then(newAdmins => {
                                                        expect(newAdmins.subRoles).includes(users.roleId);
                                                        done();
                                                    })
                                            })
                                    });
                            });
                    });
            })
            .catch(err => {
                console.log(err);
                assert.fail(err);
                done();
            })
    });

    it('should add users as subRole of toolsmangers', function (done) {
        RoleServices.createRole({ name: 'users', label: 'users' })
            .then(users => {
                RoleServices.createRole({ name: 'toolsmanagers', label: 'toolsmanagers' })
                    .then(() => {
                        RoleServices.createRole({ name: 'administrators', label: 'administrators' })
                            .then(admin => {
                                RoleServices.addSubRoleToRole({ roleId: admin.roleId, subRoleId: users.roleId })
                                    .then(() => {
                                        initusersdb()
                                            .then(() => {
                                                RoleServices.findRoleByName({ name: 'toolsmanagers' })
                                                    .then(newTools => {
                                                        expect(newTools.subRoles).includes(users.roleId);
                                                        done();
                                                    })
                                            })
                                    });
                            });
                    });
            })
            .catch(err => {
                console.log(err);
                assert.fail(err);
                done();
            })
    });


});