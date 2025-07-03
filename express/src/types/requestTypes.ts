import { Request } from 'express';
import { IUser } from '../models/userModel';

export interface IRequest extends Request {
  user?: IUser;
} 

// specialised version of express request object so that TS understands
// that after protect middleware runs the req object will contain logged in
// users info