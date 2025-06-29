import { Request, Response } from 'express';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req: Request, res: Response) => {
  try {
    console.log('[Register User] - Request received.');
    const { name, email, password } = req.body;
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

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.lastOnline = new Date();
    await user.save();
    
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      user_id: user.user_id,
      token: generateToken(user.id),
      createdAt: user.createdAt,
      lastOnline: user.lastOnline,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

export { registerUser, authUser }; 