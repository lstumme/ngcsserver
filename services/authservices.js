const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('ngcsusers');

exports.signin = async ({ login, password }) => {
    let loadedUser;
    return User.findOne({ login })
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 401;   // not authenticated
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password');
                error.statusCode = 401;
                throw error;
            }
            const secretpassword = process.env.SECRET_KEY;
            const token = jwt.sign({ login: login, userId: loadedUser._id.toString() }, secretpassword, { expiresIn: '1h' });
            return {
                token: token,
                userId: loadedUser._id.toString()
            };
        })
};

exports.decodeToken = ({ token }) => {
    let decodedToken;
    if (!token) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        throw error;
    }
    try {
        const secretpassword = process.env.SECRET_KEY;
        decodedToken = jwt.verify(token, secretpassword);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }
    return {
        userId: decodedToken.userId.toString()
    };
};
