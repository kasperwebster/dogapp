import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    });

    // Return user data with token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user data with token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create initial admin user
export const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    await User.create({
      username: 'admin',
      email: 'admin@dogapp.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}; 