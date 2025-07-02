import { Request, Response } from "express";
import { addressService } from "./address.service";
import { errorResponse } from "../../../utils/response";
import { AppError } from "../../../utils/errors";

export const addressController = {
    getUserAddress: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError("User not authenticated", 401);
            }
            
            const addresses = await addressService.getAddress(userId);
            res.status(200).json(addresses);
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
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError("User not authenticated", 401);
            }
            
            const { 
                fullName, 
                phone, 
                streetName, 
                city, 
                postalCode, 
                region, 
                isDefault = false 
            } = req.body;
            
            const addressData = { 
                fullName, 
                phone, 
                streetName, 
                city, 
                postalCode, 
                region, 
                isDefault: isDefault === true || isDefault === "true" 
            };

            // validate request body
            if (!fullName || !phone || !streetName || !city || !postalCode || !region) {
                throw new AppError('All required fields must be provided', 400);
            }

            const address = await addressService.createAddress(userId, addressData);
            res.status(201).json(address);
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

    updateAddress: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const addressId = req.params.id;
            
            if (!userId) {
                throw new AppError("User not authenticated", 401);
            }
            
            if (!addressId) {
                throw new AppError("Address ID is required", 400);
            }
            
            const { 
                fullName, 
                phone, 
                streetName, 
                city, 
                postalCode, 
                region, 
                isDefault 
            } = req.body;
            
            // Build update data with only provided fields
            const updateData: any = {};
            if (fullName !== undefined) updateData.fullName = fullName;
            if (phone !== undefined) updateData.phone = phone;
            if (streetName !== undefined) updateData.streetName = streetName;
            if (city !== undefined) updateData.city = city;
            if (postalCode !== undefined) updateData.postalCode = postalCode;
            if (region !== undefined) updateData.region = region;
            if (isDefault !== undefined) updateData.isDefault = isDefault === true || isDefault === "true";
            
            // Validate that at least one field is being updated
            if (Object.keys(updateData).length === 0) {
                throw new AppError("No fields to update", 400);
            }
            
            const updatedAddress = await addressService.updateAddress(userId, addressId, updateData);
            res.status(200).json(updatedAddress);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(500).json({ message: "An unknown error occurred" });
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