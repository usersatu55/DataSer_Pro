const studentMiddleware = (req, res, next) => {
    if (req.user.userType === 'student') {
        return next(); 
    } else {
        return res.status(403).json({ message: 'Access denied: Students only' });
    }
};

module.exports = studentMiddleware;