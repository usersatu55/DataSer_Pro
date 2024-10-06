const express = require('express');
const routes = express.Router();


const teacherController = require('../controller/teachersController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/' ,authMiddleware, teacherController.getTeacher)
routes.post('/create' ,authMiddleware, teacherController.createTeacher)
routes.post('/create/array' ,teacherController.createArrayTeacher)
routes.delete('/del' ,authMiddleware , teacherController.deleteTeacher)
routes.put('/update' ,authMiddleware,teacherController.updateTeacher)
routes.put('/updateS', authMiddleware,teacherController.teacherUpdateStudent)


module.exports = routes;