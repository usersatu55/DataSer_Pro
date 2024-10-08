const express = require('express');
const routes = express.Router();

const authMiddleware = require('../middleware/authMiddle');
const studentMiddleware = require('../middleware/studentMiddleware')
const teasherMiddleware = require('../middleware/teacherMiddleware');
const courseController = require('../controller/coursesController');



routes.get('/', courseController.getCoures)
routes.post('/create',authMiddleware, courseController.createCourse)
routes.delete('/del' , courseController.deleteCourse)
routes.put('/update' , courseController.updateCourse)


routes.get('/by' , authMiddleware , courseController.getCourseBy)
routes.get('/byc' , courseController.getCourseByCode)




module.exports = routes;