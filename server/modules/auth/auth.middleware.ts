import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import rateLimit from 'express-rate-limit';

export const validate = (schemas: {
  body?: AnyZodObject,
  query?: AnyZodObject,
  params?: AnyZodObject
}) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (schemas.body) {
      req.body = await schemas.body.parseAsync(req.body);
    }
    if (schemas.query) {
      req.query = await schemas.query.parseAsync(req.query);
    }
    if (schemas.params) {
      req.params = await schemas.params.parseAsync(req.params);
    }
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors
      });
    } else {
      res.status(500).json({ 
        message: 'An unexpected error occurred during validation' 
      });
    }
  }
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Middleware to check if the user is authenticated
  // This is a placeholder implementation. You should replace it with your actual authentication logic.
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Verify the token and extract user information
  // If valid, call next(), otherwise send an error response
  next();
}

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

export const sanitizeInput = (req: Request, res: Response, next: NextFunction): void => {
        const sanitize = (value: any): any => {
            if (typeof value === 'string') {
                return value
                    .replace(/<script.*?>.*?<\/script>/gi, '') // remove script tags
                    .replace(/javascript:/gi, ''); // remove javascript: protocol
            }
            return value;
        };

        const sanitizeObject = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]); // recursive call for nested objects
                } else {
                    obj[key] = sanitize(obj[key]);
                }
            }
        };

        if (req.body) sanitizeObject(req.body);
        if (req.query) sanitizeObject(req.query);
        if (req.params) sanitizeObject(req.params);

        next();
}