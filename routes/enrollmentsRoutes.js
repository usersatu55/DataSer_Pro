const express = require('express');
const routes = express.Router();
const enrollmentController = require('../controller/enrollmentsController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/',enrollmentController.getEnrollments)
routes.get('/by' , authMiddleware , enrollmentController.getEnrollmentsByStudent)
routes.get('/byc' , enrollmentController.getEnrollmentByCourse)
routes.post('/create', enrollmentController.createEnrollments)
routes.post('/create/array' , enrollmentController.createEnrollmentsArray)
routes.delete('/del' , enrollmentController.deleteEnrollment)
routes.get('/bys', enrollmentController.getStudentInEnrollment)

module.exports = routes;