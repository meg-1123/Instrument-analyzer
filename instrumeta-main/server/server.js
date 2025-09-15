// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js'; 
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb://127.0.0.1:27017/instrumentDetection';

mongoose.connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected");

    const adminEmail = "admin@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const adminUser = new User({
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      await adminUser.save();
      console.log("Default admin user created");
    } else {
      console.log("Admin already exists");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

// Use your routes here
app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes); 
