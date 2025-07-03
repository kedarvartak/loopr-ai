import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

export default router; 