const express = require('express');
const routes = express.Router();


const teacherController = require('../controller/teachersController')


routes.get('/' , teacherController.getTeacher)
routes.post('/create' , teacherController.createTeacher)
routes.post('/create/array' ,teacherController.createArrayTeacher)
routes.delete('/del' , teacherController.deleteTeacher)
routes.put('/update' , teacherController.updateTeacher)

module.exports = routes;