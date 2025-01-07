const mongoose = require('mongoose');

// Database connection function
const connectDB = async () => {
  try {
    // MongoDB URI (replace with your own MongoDB URI)
    const dbURI = process.env.MONGOURL;  // Example for local MongoDB
    
    // Option to automatically connect on first try and use new server discovery and monitoring engine
  

    // Connect to MongoDB
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = {connectDB};
