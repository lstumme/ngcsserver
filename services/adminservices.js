const { UserServices } = require('ngcsusers');
const { RoleServices } = require('ngcsroles');

exports.isAdmin = async ({ userId }) => {
    return UserServices.getUser({ userId: userId })
        .then(user => {
            return RoleServices.findRoleByName({ name: 'administrators' })
                .then(admins => {
                    return user.role === admins.roleId;
                })
                .catch(() => {
                    const error = new Error('administrators group not found');
                    throw error;
                })
        })
};

exports.isToolManager = async ({ userId }) => {
    return RoleServices.findRoleByName({ name: 'toolsmanagers' })
        .then(role => {
            return UserServices.getUser({ userId: userId })
                .then(user => {
                    if (user.role === role.roleId) {
                        return true;
                    }
                    return RoleServices.getRole({ roleId: user.role })
                        .then(userrole => {
                            return userrole.subRoles.includes(role.roleId);
                        })
                })
        })
        .catch(() => {
            return false;
        })
};

