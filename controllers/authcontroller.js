const authServices = require('../services/authservices');

exports.login = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;
    if (!login || !password) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        next(error);
    }
    return authServices.signin({ login, password })
        .then(response => {
            res.status(200).json({ message: 'Access granted', data: response });
            return response;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};


