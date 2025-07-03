import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/userModel';
import { IRequest } from '../types/requestTypes';

interface JwtPayload {
  id: string;
}

const protect = async (req: IRequest, res: Response, next: NextFunction) => {
  let token;

  // console.log('Inside Protect Middleware');
  // console.log('Request Cookies:', req.cookies);

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

export { protect }; 