const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000 // Stop trying after 8 seconds instead of 30
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ Database connection error: ${err.message}`);
    // If we can't connect at startup, we stop the server
    process.exit(1); 
  }
};

// Listen for connection losses after startup
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error(`🚨 MongoDB runtime error: ${err}`);
});

module.exports = connectDB;