import { Request, Response } from "express";
import { wishlistService } from "./wishlist.service";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from "../../../utils/response";
import logger from "../../../utils/logger";

export const wishlistController = {
    getWishlist: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            
            if (!userId) {
                res.status(401).json(errorResponse("User not authenticated"));
                return;
            }
            
            const wishlist = await wishlistService.getWishlist(userId);
            res.status(200).json(wishlist);
        } catch (error) {
            logger.error("Error in getWishlist controller:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse('An unknown error occurred'));
            }
        }
    },

    addToWishlist: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const { productId } = req.body;
            
            if (!userId) {
                res.status(401).json(errorResponse("User not authenticated"));
                return;
            }

            if (!productId) {
                res.status(400).json(errorResponse("Product ID is required"));
                return;
            }

            const wishlistItem = await wishlistService.addToWishlist(userId, productId);
            res.status(201).json(successResponse("Item added to wishlist", wishlistItem));
        } catch (error) {
            logger.error("Error in addToWishlist controller:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse('An unknown error occurred'));
            }
        }
    },

    removeFromWishlist: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId; // Changed from id to userId
            const { productId } = req.params;
            
            if (!userId) {
                res.status(401).json(errorResponse("User not authenticated"));
                return;
            }

            if (!productId) {
                res.status(400).json(errorResponse("Product ID is required"));
                return;
            }

            const result = await wishlistService.removeFromWishlist(userId, productId);
            res.status(200).json(successResponse("Item removed from wishlist"));
        } catch (error) {
            logger.error("Error in removeFromWishlist controller:", error);
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json(errorResponse('An unknown error occurred'));
            }
        }
    }
}