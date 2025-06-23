import { Response, Request } from "express";
import { authService, login } from "./auth.service";
import { z } from "zod";
import { AppError } from "../../../utils/errors";
import { successResponse, errorResponse } from "../../../utils/response";

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const loginSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        loginSchema.parse({ email, password });

        // Call the login service
        const result = await login(email, password);

        // Send success response
        res.status(200).json(
            successResponse('Admin login successful', result),
        );
    } catch (error) {
        if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
    }
}

export const authController = {
    fetchProfile: async (req: Request, res: Response) => {
        try {
            const admin = await authService.fetchProfile(req.user.id)
            if (!admin) {
                throw new AppError('Admin not found', 404);
            }
            res.status(200).json(
                successResponse('Admin profile fetched successfully', admin),
            );
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            }  else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
        
    },

    changePassword: async (req: Request, res: Response) => {
        try {
            const { currentPassword, newPassword } = req.body
            const password = await authService.changePassword(req.user.id, currentPassword, newPassword)
            res.status(200).json(
                successResponse('Password changed successfully', password),
            );
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

   
    updateProfile: async (req: Request, res: Response) => {
        try {
            const profileData = req.body;
            
            // Add the uploaded file to the profile data
            if (req.file) {
                profileData.files = [req.file];
            }
            
            const updatedProfile = await authService.updateProfile(req.user.id, profileData);
            res.status(200).json(
                successResponse('Profile updated successfully', updatedProfile),
            );
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    }
}