import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRouter from './Routes/authRoute.js';
import profileRoutes from './Routes/profileRoute.js';
import lostItemRoutes from './Routes/findLostRoute.js';
import uploadRoutes from './Routes/uploadRoute.js'; // Add this line

import connectDB from './Config/dbConfig.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/api', lostItemRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes); // Add this route
app.use('/api', lostItemRoutes);
// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
