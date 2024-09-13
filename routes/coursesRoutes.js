const express = require('express');
const routes = express.Router();

const authMiddleware = require('../middleware/authMiddle');
const studentMiddleware = require('../middleware/studentMiddleware')
const courseController = require('../controller/coursesController');



routes.get('/', courseController.getCoures)
routes.post('/create',authMiddleware, courseController.createCourse)
routes.delete('/del' , courseController.deleteCourse)
routes.put('/update' , courseController.updateCourse)
routes.get('/by' , authMiddleware , courseController.getCourseBy)


module.exports = routes;