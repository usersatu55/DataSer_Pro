const express = require('express');
const dotenv = require('dotenv');
const condb = require('./server/condb'); 

const studentRoutes = require('./routes/studentRoutes')

dotenv.config({ path: './.env.dev' });

const app = express();

app.use(express.json());

app.use('/api',studentRoutes)


condb.connectToDB();



const PORT = process.env.PORT || 3000;

app.listen(PORT,'localhost', () => {
  console.log(`Server is running on port ${PORT}`);
});
