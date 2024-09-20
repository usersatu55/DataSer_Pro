const express = require('express');
const routes = express.Router();

const studentController = require('../controller/studentController');
const authMiddleware = require('../middleware/authMiddle');

routes.get('/', studentController.getStudent);
routes.post('/create', studentController.createStudent);
routes.post('/create/array', studentController.createAraayStudents);
routes.delete('/del' , studentController.deleteStudent);
routes.put('/update' ,authMiddleware , studentController.updateStudent)

module.exports = routes;
