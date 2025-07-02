import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";

export const wishlistService = {
    async getWishlist(userId: string) {
        try {
            const wishlist = await prisma.wishlist.findMany({
                where: { userId },
                include: { 
                    product: {
                        include: {
                            category: true
                        }
                    } 
                },
            });
            return wishlist;
        } catch (error) {
            logger.error("Error getting wishlist:", error);
            throw new Error("Could not retrieve wishlist");
        }
    },

    async addToWishlist(userId: string, productId: string) {
        try {
            // Check if product exists
            const product = await prisma.product.findUnique({
                where: { id: productId }
            });
            
            if (!product) {
                throw new Error("Product not found");
            }
            
            const existingItem = await prisma.wishlist.findFirst({
                where: { userId, productId },
            });

            if (existingItem) {
                throw new Error("Item already in wishlist");
            }

            const wishlistItem = await prisma.wishlist.create({
                data: { userId, productId },
                include: { 
                    product: {
                        include: {
                            category: true
                        }
                    } 
                }
            });

            return wishlistItem;
        } catch (error) {
            logger.error("Error adding to wishlist:", error);
            throw error;
        }
    },

    async removeFromWishlist(userId: string, productId: string) {
        try {
            const wishlistItem = await prisma.wishlist.findFirst({
                where: { userId, productId },
            });

            if (!wishlistItem) {
                throw new Error("Item not found in wishlist");
            }

            await prisma.wishlist.delete({
                where: { id: wishlistItem.id },
            });

            return { success: true, message: "Item removed from wishlist" };
        } catch (error) {
            logger.error("Error removing from wishlist:", error);
            throw error;
        }
    }
};