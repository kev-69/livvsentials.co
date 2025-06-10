import { prisma } from "../../../shared/prisma";
import { OrderStatus } from "@prisma/client";
import { AppError } from "../../../utils/errors";

export const orderServices = {
    async getOrders() {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return orders;
    },

    async getOrderById(orderId: string) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                payments: true
            },
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        return order;
    },

    async shipOrder(orderId: string) {
        // First check if order exists and is in a valid state for shipping
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.orderStatus === OrderStatus.CANCELLED) {
            throw new AppError("Cannot ship a cancelled order", 400);
        }

        if (order.orderStatus === OrderStatus.DELIVERED) {
            throw new AppError("Order has already been delivered", 400);
        }

        if (order.orderStatus === OrderStatus.SHIPPED) {
            throw new AppError("Order has already been shipped", 400);
        }

        // Update order status to SHIPPED
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                orderStatus: OrderStatus.SHIPPED
            },
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Here you could also trigger shipping notifications to the customer
        // e.g., sendShippingNotification(updatedOrder);

        return updatedOrder;
    },

    async cancelOrder(orderId: string) {
        // First check if order exists and is in a valid state for cancellation
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: true
            }
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.orderStatus === OrderStatus.CANCELLED) {
            throw new AppError("Order has already been cancelled", 400);
        }

        if (order.orderStatus === OrderStatus.DELIVERED) {
            throw new AppError("Cannot cancel an order that has been delivered", 400);
        }

        // Start a transaction to ensure all operations succeed or fail together
        return prisma.$transaction(async (tx) => {
            // 1. Update order status to CANCELLED
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: OrderStatus.CANCELLED
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },
                    user: true
                }
            });

            // 2. Restore inventory for all order items
            for (const item of order.orderItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                            increment: item.quantity
                        }
                    }
                });
            }

            // 3. If payment was made, you might want to initiate a refund process here
            // This would typically connect to a payment gateway
            // await initiateRefund(order.id);

            // Here you could also trigger cancellation notifications to the customer
            // e.g., sendCancellationNotification(updatedOrder);

            return updatedOrder;
        });
    },

    async deliverOrder(orderId: string) {
        // First check if order exists and is in a valid state for delivery
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
            throw new AppError("Order not found", 404);
        }

        if (order.orderStatus === OrderStatus.CANCELLED) {
            throw new AppError("Cannot deliver a cancelled order", 400);
        }

        if (order.orderStatus === OrderStatus.DELIVERED) {
            throw new AppError("Order has already been delivered", 400);
        }

        // We should only mark as delivered if it's been shipped
        if (order.orderStatus !== OrderStatus.SHIPPED) {
            throw new AppError("Order must be shipped before it can be marked as delivered", 400);
        }

        // Update order status to DELIVERED
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                orderStatus: OrderStatus.DELIVERED
            },
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Here you could also trigger delivery notifications to the customer
        // e.g., sendDeliveryNotification(updatedOrder);

        return updatedOrder;
    },

    // async updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
    //     const order = await prisma.order.findUnique({
    //         where: { id: orderId }
    //     });

    //     if (!order) {
    //         throw new AppError("Order not found", 404);
    //     }

    //     // Handle inventory adjustments based on status changes
    //     if (order.orderStatus !== orderStatus) {
    //         // If cancelling an order that wasn't cancelled before
    //         if (orderStatus === OrderStatus.CANCELLED && order.orderStatus !== OrderStatus.CANCELLED) {
    //             return this.cancelOrder(orderId);
    //         }
            
    //         // If shipping an order
    //         if (orderStatus === OrderStatus.SHIPPED && order.orderStatus === OrderStatus.PROCESSING) {
    //             return this.shipOrder(orderId);
    //         }
            
    //         // If delivering an order
    //         if (orderStatus === OrderStatus.DELIVERED && order.orderStatus === OrderStatus.SHIPPED) {
    //             return this.deliverOrder(orderId);
    //         }
    //     }

    //     // Generic update for other cases
    //     const updatedOrder = await prisma.order.update({
    //         where: { id: orderId },
    //         data: { orderStatus },
    //         include: {
    //             user: true,
    //             orderItems: {
    //                 include: {
    //                     product: true
    //                 }
    //             }
    //         }
    //     });

    //     return updatedOrder;
    // },
}