const { RoleServices } = require('ngcsroles');

const adminRoleName = 'administrators'
const toolsRoleName = 'toolsmanagers';
const toolsRoleLabel = 'Gestionnaire';

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
                    return tools;
                })
                .catch(() => {
                    return RoleServices.createRole({ name: toolsRoleName, label: toolsRoleLabel });
                })
                .then(tools => {
                    if (!admins.subRoles.includes(tools.roleId)) {
                        return RoleServices.addSubRoleToRole({ roleId: admins.roleId, subRoleId: tools.roleId })
                            .then(result => {
                                return tools;
                            })
                    }
                    return tools;
                })
        })
}

module.exports = initdb;