const { assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');
const isadmin = require('../middleware/is-admin');
const istoolmanager = require('../middleware/is-toolmanager');

describe('Admin integration', function () {
    describe('#isAdmin function', function () {
        let adminRole, adminUser;
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
            adminRole = await RoleServices.createRole({ name: 'administrators', label: 'Admins' })
            adminUser = await UserServices.createUser(
                {
                    login: 'adminUser',
                    password: 'password',
                    email: 'adminuser@user.com',
                    role: adminRole.roleId
                }
            )
        });


        it('should call next if user is admin', function (done) {
            const req = {
                auth: { userId: adminUser.userId }
            }
            isadmin(req, {}, (err) => {
                if (err) {
                    console.log(err);
                    assert.fail('Error');
                }
                done();
            })
                .then(result => {
                    if (result) {    // Shoudl return nothing
                        assert.fail('Unknown Error');
                    }
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err.toString());
                });
        });
    });

    describe('#isToolManager function', function () {
        let toolRole, toolUser;
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
            userRole = await RoleServices.createRole({
                name: 'userRole',
                label: 'userRole'
            });
            toolRole = managerRole = await RoleServices.createRole({
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

            toolUser = await UserServices.createUser({
                login: 'managerUser',
                password: 'password',
                email: 'managerUser@user.com',
                role: managerRole.roleId
            })
        });


        it('should call next if user is toolmanager', function (done) {
            const req = {
                auth: { userId: toolUser.userId }
            }
            istoolmanager(req, {}, (err) => {
                if (err) {
                    console.log(err);
                    assert.fail('Error');
                }
                done();
            })
                .then(result => {
                    if (result) {    // Shoudl return nothing
                        assert.fail('Unknown Error');
                    }
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err.toString());
                });
        });
    });
});