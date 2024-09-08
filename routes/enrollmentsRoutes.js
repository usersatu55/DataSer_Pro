const express = require('express');
const routes = express.Router();
const enrollmentController = require('../controller/enrollmentsController')


routes.get('/',enrollmentController.getEnrollments)
routes.post('/create', enrollmentController.createEnrollments)
routes.post('/create/array' , enrollmentController.createEnrollmentsArray)

module.exports = routes;