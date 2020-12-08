const adminServices = require('../services/adminservices');

module.exports = async (req, res, next) => {
    const userId = req.auth.userId;
    const result = await adminServices.isAdmin({ userId });
    if (!result) {
        const error = new Error('Unauthorized');
        error.statusCode = 401;
        next(error);
    }
    next();
};