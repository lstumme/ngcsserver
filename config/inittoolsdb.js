const { RoleServices } = require('ngcsroles');

const adminRoleName = 'administrators'
const toolsRoleName = 'toolsmanagers';
const toolsRoleLabel = 'Gestionnaire';

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
                        return RoleServices.createRole({ name: toolsRoleName, label: toolsRoleLabel });
                    }
                    return tools;
                })
                .then(tools => {
                    if (!admins.subRoles.includes(tools.roleId)) {
                        return RoleServices.addSubRoleToRole({ parentRoleId: admins.roleId, subRoleId: tools.roleId })
                            .then(result => {
                                return tools;
                            })
                    }
                    return tools;
                })
        })
}

module.exports = initdb;