const teacherMiddleware = (req, res, next) => {
    if (req.user.userType === 'teacher') {
        next(); 
    } else {
        return res.status(403).json({ message: 'Access denied: Teachers only' }); 
    }
};
module.exports = teacherMiddleware;