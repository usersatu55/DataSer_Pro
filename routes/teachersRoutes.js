const express = require('express');
const routes = express.Router();


const teacherController = require('../controller/teachersController')


routes.get('/' , teacherController.getTeacher)
routes.post('/create' , teacherController.createTeacher)
routes.delete('/del' , teacherController.deleteTeacher)

module.exports = routes;