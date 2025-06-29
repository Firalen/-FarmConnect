const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable, Atlas URI, or default to local MongoDB
    let mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      // For development, you can use MongoDB Atlas (free tier)
      // Replace with your own Atlas connection string
      mongoURI = 'mongodb://localhost:27017/farmconnect';
      
      console.log('⚠️  No MongoDB URI found in environment variables');
      console.log('📝 Using local MongoDB. If you don\'t have MongoDB installed:');
      console.log('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
      console.log('   2. Or use MongoDB Atlas (free): https://www.mongodb.com/atlas');
      console.log('   3. Set MONGO_URI environment variable with your connection string');
    }
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.log('\n🔧 To fix this:');
    console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('   2. Or use MongoDB Atlas (free): https://www.mongodb.com/atlas');
    console.log('   3. Create a .env file with your MONGO_URI');
    process.exit(1);
  }
};

module.exports = connectDB; 