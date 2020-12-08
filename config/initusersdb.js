const { RoleServices } = require('ngcsroles');

const usersRoleName = 'users';
const usersLabelName = 'Utilisateur'
const adminRoleName = 'administrators'
const toolsRoleName = 'toolsmanagers';

const initdb = async () => {
    return RoleServices.findRole({ name: adminRoleName })
        .then(admins => {
            if (!admins) {
                const error = new Error(adminRoleName + ' role not found');
                throw error;
            }
            return admins;
        })
        .then(admins => {
            return RoleServices.findRole({ name: toolsRoleName })
                .then(tools => {
                    if (!tools) {
                        const error = new Error(toolsRoleName + ' role not found');
                        throw error;
                    }
                    return ({ admins, tools });
                })
        })
        .then(({ admins, tools }) => {
            return RoleServices.findRole({ name: usersRoleName })
                .then(users => {
                    if (!users) {
                        return RoleServices.createRole({ name: usersRoleName, label: usersLabelName });
                    }
                    return users;
                })
                .then(users => {
                    if (!admins.subRoles.includes(users.roleId)) {
                        return RoleServices.addSubRoleToRole({ parentRoleId: admins.roleId, subRoleId: users.roleId })
                            .then(result => {
                                return users;
                            })
                    }
                    return users;
                })
                .then(users => {
                    if (!tools.subRoles.includes(users.roleId)) {
                        return RoleServices.addSubRoleToRole({ parentRoleId: tools.roleId, subRoleId: users.roleId })
                            .then(result => {
                                return users;
                            })
                    }
                    return users;
                })
        })
}

module.exports = initdb;