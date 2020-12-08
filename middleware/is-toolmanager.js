const adminServices = require('../services/adminservices');

module.exports = async (req, res, next) => {
    const userId = req.auth.userId;
    return adminServices.isToolManager({ userId: userId })
        .then(result => {
            if (!result) {
                const error = new Error('Unauthorized');
                error.statusCode = 401;
                next(error);
            }
            next();
        })
};