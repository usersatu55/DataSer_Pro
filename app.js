const express = require('express');
const dotenv = require('dotenv');
const condb = require('./server/condb'); 

const studentRoutes = require('./routes/studentRoutes')
const courseRoutes = require('./routes/coursesRoutes')
const teacherRoutes = require('./routes/teachersRoutes')
const authRoutes = require('./routes/authRoutes')

dotenv.config({ path: './.env.dev' });

const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

app.use('/student',studentRoutes)
app.use('/courses',courseRoutes)
app.use('/teacher',teacherRoutes)
app.use('/auth' , authRoutes)



condb.connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT,'localhost', () => {
  console.log(`Server is running on port ${PORT}`);
});
