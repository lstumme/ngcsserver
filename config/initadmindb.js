const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');

const adminRoleName = 'administrators'
const adminRoleLabel = 'Administrateurs'

const initdb = async () => {
    return RoleServices.findRole({ name: adminRoleName })
        .then(adminRole => {
            if (!adminRole) {
                return RoleServices.createRole({ name: adminRoleName, label: adminRoleLabel });
            }
            return adminRole;
        })
        .then(adminRole => {
            return UserServices.findUser({ login: 'admin' })
                .then(user => {
                    if (!user) {
                        return UserServices.createUser({
                            login: 'admin',
                            password: 'admin',
                            email: 'admin@ngcs.com',
                            role: adminRole.roleId
                        })
                    }
                    return user;
                })
                .then(user => {
                    if (user.role !== adminRole.roleId) {
                        return UserServices.updateUserDetails({ userId: user.userId, role: adminRole.roleId });
                    }
                    return user;
                })
        })
}

module.exports = initdb;