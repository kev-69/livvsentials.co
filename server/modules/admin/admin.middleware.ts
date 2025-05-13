import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/errors";

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return next(new AppError("You are not authorized to access this resource", 403));
    }
    next();
}

