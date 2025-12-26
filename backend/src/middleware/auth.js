const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization;


    if (!header) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];
    console.log('header', header)
    console.log('token extracted', token)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('token decoded', decoded)
        req.user = { id: decoded.userId };

        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
