const teacherMiddleware = (req, res, next) => {
    if (req.user.userType === 'teacher') {
        next(); // ให้ผ่านถ้าเป็น teacher
    } else {
        return res.status(403).json({ message: 'Access denied: Teachers only' }); // ห้ามเข้าถ้าไม่ใช่ teacher
    }
};
module.exports = teacherMiddleware;