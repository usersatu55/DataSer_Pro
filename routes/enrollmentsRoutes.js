const express = require('express');
const routes = express.Router();
const enrollmentController = require('../controller/enrollmentsController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/',enrollmentController.getEnrollments)
routes.get('/by' , authMiddleware , enrollmentController.getEnrollmentsByStudent)
routes.post('/create', enrollmentController.createEnrollments)
routes.post('/create/array' , enrollmentController.createEnrollmentsArray)
routes.delete('/del' , enrollmentController.deleteEnrollment)

module.exports = routes;