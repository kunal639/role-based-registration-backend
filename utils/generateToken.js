const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // We sign the token with your secret and set it to expire in 24 hours
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d' 
    });
};

module.exports = generateToken;