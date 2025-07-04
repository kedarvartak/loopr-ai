import { Response, NextFunction } from 'express';
import { IRequest } from '../types/requestTypes';

const authorizeAnalyst = (req: IRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'analyst') {
    next();
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('Not authorized as an analyst');
  }
};

export { authorizeAnalyst }; 