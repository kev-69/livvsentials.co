import { Request, Response } from "express";
import { addressService } from "./address.service";
import { errorResponse } from "../../../utils/response";
import { AppError } from "../../../utils/errors";

export const addressController = {
    getUserAddress: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId
            const address = await addressService.getAddress(userId);
            res.status(200).json(address);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: "An unknown error occurred" });
            }
        }
    },

    createAddress: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId
            const { streetName, city, postalCode, region} = req.body;
            const addressData = { streetName, city, postalCode, region}

            // validate request body
            if (!streetName || !city || !postalCode || !region) {
                throw new AppError('At least one field is required')
            }

            const address = await addressService.createAddress(userId, addressData)
            res.status(201).json(address)
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: "An unknown error occurred" });
            }
        }
    },

    deleteAddress: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const addressId = req.params.id;
            
            if (!userId) {
                throw new AppError("User not authenticated", 401);
            }
            
            if (!addressId) {
                throw new AppError("Address ID is required", 400);
            }
            
            const result = await addressService.deleteAddress(userId, addressId);
            res.status(200).json(result);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(500).json({ message: "An unknown error occurred" });
            }
        }
    }
}