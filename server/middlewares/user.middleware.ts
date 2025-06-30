import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

interface TokenPayload {
  userId: string;
}

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || '';

  if (!token) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return next(new AppError('Unauthorized: Invalid token', 401));
  }
};

export const optionalToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1] || '';

  if (!token) {
    // Continue without setting user
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    // Continue without setting user
    next();
  }
};