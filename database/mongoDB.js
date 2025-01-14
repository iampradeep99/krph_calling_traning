const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGOURL;  
    
  

    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = {connectDB};
