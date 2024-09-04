const express = require('express');
const routes = express.Router();

const studentController = require('../controller/studentController');

routes.get('/', studentController.getStudent);
routes.post('/create', studentController.createStudent);
routes.delete('/del' , studentController.deleteStudent);
routes.put('/update' , studentController.updateStudent)

module.exports = routes;
