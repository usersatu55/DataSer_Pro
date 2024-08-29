const express = require('express');
const routes = express.Router();

const studentController = require('../controller/studentController');

routes.get('/student', studentController.getStudent);
routes.post('/student/create', studentController.createStudent);

module.exports = routes;
