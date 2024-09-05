const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env.dev' });
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET);

       
        req.user = decoded;
        next(); 
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
