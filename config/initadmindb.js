const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');

const adminRoleName = 'administrators'
const adminRoleLabel = 'Administrateurs'

const initdb = async () => {
    return RoleServices.findRoleByName({ name: adminRoleName })
        .then(adminRole => {
            return adminRole;
        })
        .catch(() => {
            return RoleServices.createRole({ name: adminRoleName, label: adminRoleLabel });
        })
        .then(adminRole => {
            return UserServices.findUserByLogin({ login: 'admin' })
                .catch(() => {
                    return UserServices.createUser({
                        login: 'admin',
                        password: 'admin',
                        email: 'admin@ngcs.com',
                        role: adminRole.roleId
                    })
                })
                .then(user => {
                    if (user.role !== adminRole.roleId) {
                        return UserServices.updateUser({ userId: user.userId, role: adminRole.roleId });
                    }
                    return user;
                })
        })
}

module.exports = initdb;