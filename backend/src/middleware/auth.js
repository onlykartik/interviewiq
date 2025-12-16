const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization;
    console.log('Header',header)

    if (!header) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        console.log('Token decoded', req.user)
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
};
