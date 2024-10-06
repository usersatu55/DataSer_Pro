const express = require('express');
const routes = express.Router();

const attendanceController = require('../controller/attendanceController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/' , authMiddleware ,attendanceController.getAttendance)
routes.get('/by' , authMiddleware ,attendanceController.getAttendanceBy)
routes.post('/open' ,authMiddleware, attendanceController.openAttendance)
routes.post('/create' , authMiddleware ,attendanceController.checkInAttendance)
routes.delete('/del',authMiddleware ,attendanceController.deleteAttendance)
routes.get('/byc', authMiddleware ,attendanceController.getAttenbyCourseCode)



module.exports = routes;