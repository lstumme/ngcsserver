const { expect, assert } = require('chai');
const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');
const { dbHandler } = require('ngcstesthelpers');
const initadmindb = require('../config/initadmindb');

describe('Admin Database Initialization', function () {
    before(async () => {
        await dbHandler.connect();
    });

    after(async () => {
        await dbHandler.closeDatabase();
    });

    afterEach(async () => {
        await dbHandler.clearDatabase();
    });

    it('should create admin user and administrator role if not exist', function (done) {
        initadmindb().then(result => {
            return UserServices.findUserByLogin({ login: 'admin' })
                .then(user => {
                    if (!user) {
                        assert.fail('Admin User creation failed');
                    }
                    return user;
                })
                .then(user => {
                    RoleServices.findRoleByName({ name: 'administrators' })
                        .then(role => {
                            if (!role) {
                                assert.fail('Administrator role creation failed');
                            }
                            expect(user.role).to.equal(role.roleId);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err.toString());
                })
        });
    });

    it('should create administrators role if not exists and add existing admin user to it', function (done) {
        RoleServices.createRole({ name: 'defaultRole', label: 'defaultRole' })
            .then(defaultRole => {
                UserServices.createUser({
                    login: 'admin',
                    password: 'password',
                    email: 'localadmin@ngcs.com',
                    role: defaultRole.roleId
                })
                    .then(adminUser => {
                        initadmindb()
                            .then(result => {
                                UserServices.findUserByLogin({ login: 'admin' })
                                    .then(newAdminUser => {
                                        RoleServices.findRoleByName({ name: 'administrators' })
                                            .then(adminRole => {
                                                if (!adminRole) {
                                                    assert.fail('Admin Role creation failed');
                                                }
                                                expect(newAdminUser.userId).to.equal(adminUser.userId);
                                                expect(newAdminUser.role).to.equal(adminRole.roleId);
                                                done();
                                            })
                                    })
                            })
                    })
            })
            .catch(err => {
                console.log(err);
            })
    });

    it('should create admin user if not exists and add administrator role if already exists', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'admins' })
            .then(adminRole => {
                initadmindb().then(result => {
                    UserServices.findUserByLogin({ login: 'admin' })
                        .then(adminUser => {
                            if (!adminUser) {
                                assert.fail('Admin User creation failed');
                            }
                            expect(adminUser.role).to.equal(adminRole.roleId);
                            done();
                        })
                });
            })
    });


    it('should not change anything if everything is in order', function (done) {
        RoleServices.createRole({ name: 'administrators', label: 'admins' })
            .then(adminRole => {
                UserServices.createUser({
                    login: 'admin',
                    password: 'password',
                    email: 'localadmin@ngcs.com',
                    role: adminRole.roleId
                })
                    .then(adminUser => {
                        initadmindb()
                            .then(() => {
                                UserServices.findUserByLogin({ login: 'admin' })
                                    .then(newAdmin => {
                                        expect(newAdmin.role).to.equal(adminUser.role);
                                        expect(newAdmin.userId).to.equal(adminUser.userId);
                                        done();
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                                assert.fail(err);
                                done();
                            })
                    })
            })

    });
});
