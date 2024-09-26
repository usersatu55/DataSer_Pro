const express = require('express');
const routes = express.Router();


const teacherController = require('../controller/teachersController')
const authMiddleware = require('../middleware/authMiddle');


routes.get('/' , teacherController.getTeacher)
routes.post('/create' , teacherController.createTeacher)
routes.post('/create/array' ,teacherController.createArrayTeacher)
routes.delete('/del' , teacherController.deleteTeacher)
routes.put('/update' ,authMiddleware,teacherController.updateTeacher)
routes.put('/updateS', teacherController.teacherUpdateStudent)


module.exports = routes;