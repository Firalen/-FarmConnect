# MongoDB Setup Guide

## Quick Fix for Registration/Login Issues

The registration and login are failing because MongoDB is not connected. Here are 3 solutions:

### 🚀 Option 1: MongoDB Atlas (Recommended - Free)

1. **Go to MongoDB Atlas:** https://www.mongodb.com/atlas
2. **Create Free Account** (no credit card required)
3. **Create a Cluster** (choose free tier)
4. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
5. **Create .env file in farmconnect-backend folder:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/farmconnect
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```
6. **Replace username/password** with your Atlas credentials

### 💻 Option 2: Local MongoDB Installation

1. **Download MongoDB:** https://www.mongodb.com/try/download/community
2. **Install with default settings**
3. **Start MongoDB service:**
   ```bash
   net start MongoDB
   ```
4. **Create .env file:**
   ```
   MONGO_URI=mongodb://localhost:27017/farmconnect
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

### 🔧 Option 3: Use Default Settings (Temporary)

If you want to test quickly, the app now has default settings, but you still need MongoDB running.

## Testing the Fix

1. **Start Backend:**
   ```bash
   cd farmconnect-backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd farmconnect-frontend/farmconnect-frontend
   npm run dev
   ```

3. **Test Registration/Login:**
   - Go to http://localhost:5173
   - Try registering a new user
   - Try logging in

## Common Issues

- **"MongoDB not connected"** → Install MongoDB or use Atlas
- **"JWT error"** → Check JWT_SECRET in .env file
- **"Port already in use"** → Change PORT in .env file

## Need Help?

If you're still having issues:
1. Check the backend console for error messages
2. Make sure both servers are running
3. Check browser console for frontend errors 