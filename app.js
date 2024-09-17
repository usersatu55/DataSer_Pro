const express = require('express');
const dotenv = require('dotenv');
const condb = require('./server/condb'); 

const studentRoutes = require('./routes/studentRoutes')
const courseRoutes = require('./routes/coursesRoutes')
const teacherRoutes = require('./routes/teachersRoutes')
const authRoutes = require('./routes/authRoutes')
const enrollmentRoutes = require('./routes/enrollmentsRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')

dotenv.config({ path: './.env.dev' });

const app = express();

app.use(express.json());

const cors=require("cors");
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));






app.use('/student',studentRoutes)
app.use('/courses',courseRoutes)
app.use('/teacher',teacherRoutes)
app.use('/auth' , authRoutes)
app.use('/enroll' , enrollmentRoutes)
app.use('/atten',attendanceRoutes)



condb.connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT,'localhost', () => {
  console.log(`Server is running on port ${PORT}`);
});
