import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errors";
import { AnyZodObject, z } from 'zod';
import { errorResponse } from '../utils/response';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

type ValidationSchema = {
  params?: AnyZodObject;
  query?: AnyZodObject;
  body?: AnyZodObject;
};

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

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return next(new AppError("You are not authorized to access this resource", 403));
    }
    next();
}

/**
 * Middleware to validate request data against a schema
 * @param schema Object containing Zod schemas for params, query, and/or body
 * @returns Express middleware function
 */
export const validateRequest = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create a schema for the request sections that need validation
      const fullSchema = z.object({
        ...(schema.params ? { params: schema.params } : {}),
        ...(schema.query ? { query: schema.query } : {}),
        ...(schema.body ? { body: schema.body } : {}),
      });

      // Validate the request against the schema
      await fullSchema.parseAsync({
        params: req.params,
        query: req.query,
        body: req.body,
      });

      // If validation passes, continue to the next middleware/controller
      next();

    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        // Format the Zod validation errors into a more readable format
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json(errorResponse('Validation error', formattedErrors));
      }

      // Handle any other errors
      res.status(500).json(errorResponse('An error occurred during request validation'));
    }
  };
};