const express = require('express');
const routes = express.Router();

const attendanceController = require('../controller/attendanceController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/' , attendanceController.getAttendance)
routes.get('/by' , authMiddleware ,attendanceController.getAttendanceBy)
routes.post('/open' , attendanceController.openAttendance)
routes.post('/create' , authMiddleware ,attendanceController.checkInAttendance)
routes.delete('/del',attendanceController.deleteAttendance)



module.exports = routes;