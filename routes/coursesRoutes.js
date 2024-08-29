const express = require('express');
const routes = express.Router();


const courseController = require('../controller/coursesController');


routes.get('/', courseController.getCoures)
routes.post('/create', courseController.createCourse)


module.exports = routes;