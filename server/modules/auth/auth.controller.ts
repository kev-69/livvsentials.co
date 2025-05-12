import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AppError } from '../../utils/errors';
import { successResponse, errorResponse } from '../../utils/response';

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { email, password, firstName, lastName, phone } = req.body;

            // Validate request body
            if (!email || !password || !firstName || !lastName || !phone) {
                throw new AppError('All fields are required', 400);
            }

            // Call the auth service to register the user
            const user = await authService.register(email, password, firstName, lastName, phone);

            // Send success response
            res.status(201).json(successResponse('User registered successfully', user));
        } catch (error) {
            // Handle errors and send error response
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            // Validate request body
            if (!email || !password) {
                throw new AppError('Email and password are required', 400);
            }

            // Call the auth service to log in the user
            const token = await authService.login(email, password);

            // Send success response
            res.status(200).json(successResponse('User logged in successfully', token));
        } catch (error) {
            // Handle errors and send error response
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    // reset password

    // verify code for reset password

    // set new password
    setNewPassword: async (req: Request, res: Response) => {
        try {
            const { password, confirmPassword } = req.body;

            // Validate request body
            if (!password || !confirmPassword) {
                throw new AppError('Password and confirm password are required', 400);
            }

            // Call the auth service to set a new password
            await authService.setNewPassword(password, confirmPassword);

            // Send success response
            res.status(200).json(successResponse('Password updated successfully'));
        } catch (error) {
            // Handle errors and send error response
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    // resend reset password code  
};