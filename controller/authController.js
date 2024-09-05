const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../schema/teacherSchema');
const Student = require('../schema/studentSchema');

require('dotenv').config({ path: '.env.dev' });
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Bad Request"
        });
    }

    try {
        
        const student = await Student.findOne({ email: email });

        if (student && bcrypt.compareSync(password, student.password)) {
            const token = jwt.sign(
                {
                    id: student._id,
                    userType: 'student',
                    student_id:student.student_id,
                    first_name: student.first_name, 
                    last_name: student.last_name,   
                    email: student.email           
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                token: token,
                userType: 'student',
                user: student
            });
        }

       
        const teacher = await Teacher.findOne({ email: email });

        if (teacher && bcrypt.compareSync(password, teacher.password)) {
            const token = jwt.sign(
                {
                    id: teacher._id,
                    userType: 'teacher',
                    first_name: teacher.first_name, 
                    last_name: teacher.last_name,   
                    email: teacher.email            
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                token: token,
                userType: 'teacher',
                user: teacher
            });
        }

        
        return res.status(404).json({
            message: "Not Found"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};
