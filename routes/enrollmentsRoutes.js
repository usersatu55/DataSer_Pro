const express = require('express');
const routes = express.Router();
const enrollmentController = require('../controller/enrollmentsController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/',authMiddleware , enrollmentController.getEnrollments)
routes.get('/by' , authMiddleware , enrollmentController.getEnrollmentsByStudent)
routes.get('/byc' ,authMiddleware, enrollmentController.getEnrollmentByCourse)
routes.post('/create', authMiddleware ,enrollmentController.createEnrollments)
routes.post('/create/array' ,authMiddleware, enrollmentController.createEnrollmentsArray)
routes.delete('/del' ,authMiddleware, enrollmentController.deleteEnrollment)
routes.get('/bys', authMiddleware ,enrollmentController.getStudentInEnrollment)

module.exports = routes;