const express = require('express');
const routes = express.Router();

const studentController = require('../controller/studentController');

routes.get('/', studentController.getStudent);
routes.post('/create', studentController.createStudent);

module.exports = routes;
