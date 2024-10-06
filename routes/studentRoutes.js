const express = require('express');
const routes = express.Router();

const studentController = require('../controller/studentController');
const authMiddleware = require('../middleware/authMiddle');

routes.get('/', authMiddleware ,studentController.getStudent);
routes.post('/create',authMiddleware , studentController.createStudent);
routes.post('/create/array', authMiddleware ,studentController.createAraayStudents);
routes.delete('/del' , authMiddleware ,studentController.deleteStudent);
routes.put('/update' ,authMiddleware , studentController.updateStudent)
routes.delete('/delEn', authMiddleware , studentController.studentDeleteEnrollment)

module.exports = routes;
