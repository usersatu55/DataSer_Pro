const express = require('express');
const routes = express.Router();

const attendanceController = require('../controller/attendanceController')


routes.get('/' , attendanceController.getAttendance)
routes.get('/by' , attendanceController.getAttendanceBy)
routes.post('/create' , attendanceController.openAttendance)



module.exports = routes;