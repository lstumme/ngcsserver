const { RoleServices } = require('ngcsroles');

const usersRoleName = 'users';
const usersLabelName = 'Utilisateur'
const adminRoleName = 'administrators'
const toolsRoleName = 'toolsmanagers';

const initdb = async () => {
    return RoleServices.findRoleByName({ name: adminRoleName })
        .then(admins => {
            return admins;
        })
        .catch(() => {
            const error = new Error(adminRoleName + ' role not found');
            throw error;
        })
        .then(admins => {
            return RoleServices.findRoleByName({ name: toolsRoleName })
                .then(tools => {
                    return ({ admins, tools });
                })
                .catch(() => {
                    const error = new Error(toolsRoleName + ' role not found');
                    throw error;
                })
        })
        .then(({ admins, tools }) => {
            return RoleServices.findRoleByName({ name: usersRoleName })
                .then(users => {
                    return users;
                })
                .catch(() => {
                    return RoleServices.createRole({ name: usersRoleName, label: usersLabelName });
                })
                .then(users => {
                    if (!admins.subRoles.includes(users.roleId)) {
                        return RoleServices.addSubRoleToRole({ roleId: admins.roleId, subRoleId: users.roleId })
                            .then(result => {
                                return users;
                            })
                    }
                    return users;
                })
                .then(users => {
                    if (!tools.subRoles.includes(users.roleId)) {
                        return RoleServices.addSubRoleToRole({ roleId: tools.roleId, subRoleId: users.roleId })
                            .then(result => {
                                return users;
                            })
                    }
                    return users;
                })
        })
}

module.exports = initdb;