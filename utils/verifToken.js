const jwt = require('jsonwebtoken');

const verifToken = async (req, res, next) => {

    try {
        const token = req.headers['access-token'];
        if (!token) {
            res.json({ success: false, message: 'No Token Provided' });
        } else {
            const verif = jwt.verify(token, 'TOKEN_SECRET');
            if (verif) {
                next();
            } else {
                res.json({ success: false, message: 'Invalid Token' });
            }
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

module.exports = verifToken; 