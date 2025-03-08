import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import incidentRoutes from './routes/incidents';
import userRoutes from './routes/users';

// Import admin user creation function
import { createAdminUser } from './controllers/users';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/incidents', incidentRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Create admin user
    createAdminUser();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app; 