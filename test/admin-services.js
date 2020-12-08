const { expect, assert } = require('chai');
const { ObjectId } = require('mongodb');
const AdminServices = require('../services/adminservices');
const { dbHandler } = require('ngcstesthelpers');
const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');
const { ToolServices } = require('ngcstools');

describe('admin services', function () {
    describe("#isAdmin function", function () {
        let adminRole, defaultRole, adminUser, normalUser;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        beforeEach(async () => {
            adminRole = await RoleServices.createRole({ name: 'administrators', label: 'Admin' });
            defaultRole = await RoleServices.createRole({ name: 'default', label: 'default' });
            adminUser = await UserServices.createUser({
                login: 'adminUser',
                password: 'password',
                email: 'adminuser@user.com',
                role: adminRole.roleId
            })
            normalUser = await UserServices.createUser({
                login: 'normalUser',
                password: 'password',
                email: 'normaluser@user.com',
                role: defaultRole.roleId
            })
        });

        it('should throw an error if adminnistrators role doesnt exists', function (done) {
            RoleServices.deleteRole({ roleId: adminRole.roleId })
                .then(result => {
                    AdminServices.isAdmin({ userId: adminUser.userId })
                        .then(result => {
                            assert.fail('Service error');
                            done();
                        })
                        .catch(err => {
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        })

        it('should return true if user is member of administrators group', function (done) {
            AdminServices.isAdmin({ userId: adminUser.userId })
                .then(result => {
                    expect(result).to.be.true;
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });

        it('should return false if user is not member of administrators group', function (done) {
            AdminServices.isAdmin({ userId: normalUser.userId })
                .then(result => {
                    expect(result).to.be.false;
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });
    });

    describe("#isToolManager function", function () {
        let userRole, managerRole, adminRole;

        before(async () => {
            this.timeout(10000);
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        beforeEach(async () => {
            userRole = await RoleServices.createRole({
                name: 'userRole',
                label: 'userRole'
            });
            managerRole = await RoleServices.createRole({
                name: 'toolsmanagers',
                label: 'toolsmanagers',
            });
            await RoleServices.addSubRoleToRole({ roleId: managerRole.roleId, subRoleId: userRole.roleId });

            adminRole = await RoleServices.createRole({
                name: 'adminRole',
                label: 'adminRole',
            });
            await RoleServices.addSubRoleToRole({ roleId: adminRole.roleId, subRoleId: userRole.roleId });
            await RoleServices.addSubRoleToRole({ roleId: adminRole.roleId, subRoleId: managerRole.roleId });

        });

        it('should return false if user not found', function (done) {
            const userId = new ObjectId();
            AdminServices.isToolManager({ userId: userId.toString() })
                .then(result => {
                    expect(result).to.be.false;
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });

        it('should return false if toolsmanager role is not defined', function (done) {
            UserServices.createUser({
                login: 'managerUser',
                password: 'password',
                email: 'managerUser@user.com',
                role: managerRole.roleId
            }).then(managerUser => {
                RoleServices.deleteRole({ roleId: managerRole.roleId })
                    .then(result => {
                        AdminServices.isToolManager({ userId: managerUser.userId })
                            .then(result => {
                                expect(result).to.be.false;
                                done();
                            })
                    })
            })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });

        it('should return true if user is member of toolManager group', function (done) {
            UserServices.createUser({
                login: 'managerUser',
                password: 'password',
                email: 'managerUser@user.com',
                role: managerRole.roleId
            })
                .then(managerUser => {
                    AdminServices.isToolManager({ userId: managerUser.userId })
                        .then(result => {
                            expect(result).to.be.true;
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });

        it('should return true if user is member of a superGroup of toolManager', function (done) {
            UserServices.createUser({
                login: 'adminUser',
                password: 'password',
                email: 'adminUser@user.com',
                role: adminRole.roleId

            })
                .then(adminUser => {
                    AdminServices.isToolManager({ userId: adminUser.userId })
                        .then(result => {
                            expect(result).to.be.true;
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });

        it('should return false if user is not member of administrators group or from his supergroup', function (done) {
            UserServices.createUser({
                login: 'simpleUser',
                password: 'password',
                email: 'simpleUser@user.com',
                role: userRole.roleId
            })
                .then(simpleUser => {
                    AdminServices.isToolManager({ userId: simpleUser.userId })
                        .then(result => {
                            expect(result).to.be.false;
                            done();
                        })

                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
        });
    });


});





