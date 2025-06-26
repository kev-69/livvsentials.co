import { Request, Response } from "express";
import { userServices } from "./user.service";
import { AppError } from "../../../utils/errors";
import { successResponse, errorResponse } from "../../../utils/response";

export const userController = {
    getAllUsers: async (req: Request, res: Response) => {
        try {
            const users = await userServices.getAllUsers();
            res.status(200).json(successResponse("Users retrieved successfully", users));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    getUserById: async (req: Request, res: Response) => {
        const userId = req.params.id;
        try {
            const user = await userServices.getUserById(userId);
            if (!user) {
                res.status(404).json(errorResponse("User not found"));
                return;
            }
            res.status(200).json(successResponse("User retrieved successfully", user));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },
    
    getUserStats: async (req: Request, res: Response) => {
        try {
            const stats = await userServices.getUserStats();
            res.status(200).json(successResponse("User statistics retrieved successfully", stats));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },
    
    getGuestCheckouts: async (req: Request, res: Response) => {
        try {
            const guestStats = await userServices.getGuestCheckouts();
            res.status(200).json(successResponse("Guest checkout statistics retrieved successfully", guestStats));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },
}