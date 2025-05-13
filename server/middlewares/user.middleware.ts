import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // console.error('No token provided');
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        // console.log('Token:', token);
        // console.log('JWT_SECRET:', process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        // console.error('Token verification failed:', err);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};