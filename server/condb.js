const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.dev' });

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); 
  }
};

module.exports = {
  connectToDB
};
