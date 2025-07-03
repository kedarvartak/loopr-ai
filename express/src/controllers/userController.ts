import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import generateToken from '../utils/generateToken';
import { IRequest } from '../types/requestTypes';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('[Register User] - Request received.');
    const { name, email, password } = req.body;
    console.log('Registering new user with email:', email); // Debug log
    console.log('[Register User] - Body:', { name, email });

    console.log('[Register User] - Checking if user exists...');
    const userExists = await User.findOne({ email });

    if (userExists) {
      console.log('[Register User] - User already exists.');
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    console.log('[Register User] - Creating new user...');
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log('[Register User] - User created successfully:', user._id);

    if (user) {
      console.log('[Register User] - Generating token...');
      const token = generateToken(user.id);
      console.log('User registered, token generated:', token); // Debug log
      console.log('[Register User] - Token generated.');

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        createdAt: user.createdAt,
        lastOnline: user.lastOnline,
      });
    } else {
      console.log('[Register User] - User creation failed validation.');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('[Register User] - An unexpected error occurred:', error);
    res.status(500).json({ message: 'Internal Server Error due to an exception.' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email); // Debug log

  const user: IUser | null = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.lastOnline = new Date();
    await user.save();
    
    const token = generateToken(user.id);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'lax', // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      user_id: user.user_id,
      createdAt: user.createdAt,
      lastOnline: user.lastOnline,
    });
  } else {
    console.log('Invalid email or password for email:', email); // Debug log
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (req: IRequest, res: Response) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req: Request, res: Response) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export { registerUser, authUser, logoutUser, getUserProfile }; 