import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";
import { AppError } from "../../../utils/errors";

export const orderService = {
    getUserOrders: async (userId: string) => {
        try {
            const orders = await prisma.order.findMany({
                where: {
                    userId,
                },
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    productImages: true,
                                }
                            },
                        }
                    },
                }
            });
            return orders;
        } catch (error) {
            logger.error("Error getting user orders:", error);
            throw new AppError("Could not retrieve orders", 500);
        }
    },

    getOrderById: async (orderId: string) => {
        try {
            const order = await prisma.order.findUnique({
                where: {
                    id: orderId,
                },
            });
            return order;
        } catch (error) {
            logger.error("Error getting order by ID:", error);
            throw new AppError("Could not retrieve order", 500);
        }
    },
}