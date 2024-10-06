const express = require('express');
const routes = express.Router();

const authMiddleware = require('../middleware/authMiddle');
const studentMiddleware = require('../middleware/studentMiddleware')
const teasherMiddleware = require('../middleware/teacherMiddleware');
const courseController = require('../controller/coursesController');



routes.get('/',courseController.getCoures)
routes.post('/create',authMiddleware, courseController.createCourse)
routes.delete('/del' , authMiddleware , courseController.deleteCourse)
routes.put('/update' ,authMiddleware , courseController.updateCourse)


routes.get('/by' , authMiddleware , courseController.getCourseBy)
routes.get('/byc' ,authMiddleware, courseController.getCourseByCode)




module.exports = routes;