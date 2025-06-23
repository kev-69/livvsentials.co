import { prisma } from "../../../shared/prisma";
import { OrderStatus } from "@prisma/client";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";

export const orderServices = {
    // will use this same function to get the total orders
    async getOrders() {
        try {
            const orders = await prisma.order.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            email: true,
                        },
                    },
                    orderItems: true,
                    payments: {
                    select: {
                        id: true,
                        amount: true,
                        paymentStatus: true,
                        paymentMethod: true,
                    },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            const transformedOrders = orders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                customer: {
                    id: order.user.id,
                    firstName: order.user.firstName,
                    lastName: order.user.lastName,
                    email: order.user.email,
                },
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                totalAmount: order.totalAmount,
                status: order.orderStatus,
                items: order.orderItems.length,
                payment: {
                    status: order.payments.length > 0 ? order.payments[0].paymentStatus : 'PROCESSING',
                    method: order.payments.length > 0 ? order.payments[0].paymentMethod : null,
                },
                shippingAddress: order.shippingAddress,
            }));
            return transformedOrders;
        } catch (error) {
            logger.error(`Error fetching orders: ${error}`);
            throw new AppError(`Error fetching orders: ${error}`, 500);
        }
    },

    async getOrderById(orderId: string) {
        try {
            const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            phone: true,
                            email: true,
                        }
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    productImages: true,
                                }
                            },
                        },
                    },
                    payments: {
                        select: {
                            id: true,
                            amount: true,
                            paymentStatus: true,
                            paymentMethod: true,
                        }
                    }
                },
            });

            if (!order) {
                throw new AppError("Order not found", 404);
            }
            return order;
        } catch (error) {
            logger.error(`Error fetching order: ${error}`);
            throw new AppError(`Error fetching order: ${error}`, 500);
        }
        
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

    async getPendingOrders() {
        try {
            const pendingOrders = await prisma.order.findMany({
            where: {
                orderStatus: 'PROCESSING',
            },
            include: {
                user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
                },
                orderItems: true,
                payments: {
                select: {
                    id: true,
                    amount: true,
                    paymentStatus: true,
                },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            });

            const transformedOrders = pendingOrders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            customer: {
                id: order.user.id,
                firstName: order.user.firstName,
                lastName: order.user.lastName,
                email: order.user.email,
            },
            createdAt: order.createdAt,
            totalAmount: order.totalAmount,
            status: order.orderStatus,
            items: order.orderItems.length,
            payment: {
                status: order.payments.length > 0 ? order.payments[0].paymentStatus : 'PROCESSING',
            },
            }));
            return transformedOrders;
        } catch (error) {
            logger.error(`Error fetching pending orders: ${error}`);
            throw new AppError(`Error fetching pending orders: ${error}`, 500);
        }
    },

    // Get order chart data (date, count)
    async getOrdersChart() {
        try {
            // Calculate the date 90 days ago (default view in frontend)
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            
            // Get all orders within the time period
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: ninetyDaysAgo
                    }
                },
                select: {
                    createdAt: true,
                },
                orderBy: {
                    createdAt: 'asc',
                },
            });
            
            // Create a map to store date counts
            const dateCountMap = new Map();
            
            // Initialize the map with all dates in the range
            const currentDate = new Date();
            for (let d = new Date(ninetyDaysAgo); d <= currentDate; d.setDate(d.getDate() + 1)) {
                const dateString = d.toISOString().split('T')[0]; // Format: YYYY-MM-DD
                dateCountMap.set(dateString, 0);
            }
            
            // Count orders by date
            orders.forEach(order => {
                const orderDate = order.createdAt.toISOString().split('T')[0];
                dateCountMap.set(orderDate, (dateCountMap.get(orderDate) || 0) + 1);
            });
            
            // Convert map to array format expected by frontend
            const chartData = Array.from(dateCountMap, ([date, count]) => ({
                date,
                order: count
            }));
            
            // Sort by date
            chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            return chartData;
        } catch (error) {
            logger.error(`Error fetching order chart data: ${error}`);
            throw new AppError(`Error fetching order chart data: ${error}`, 500);
        }
    },

    async getAvgWeeklyOrders() {
        try {
            // Calculate the date 90 days ago (for a reasonable time period)
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            
            // Get all orders within the time period
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: ninetyDaysAgo
                    }
                },
                select: {
                    createdAt: true,
                },
            });
            
            // Calculate number of weeks (divide by 7 and round up)
            const days = Math.ceil((Date.now() - ninetyDaysAgo.getTime()) / (1000 * 60 * 60 * 24));
            const weeks = Math.ceil(days / 7);
            
            // Calculate average weekly orders
            const avgWeeklyOrders = orders.length / weeks;
            
            return {
                avgWeeklyOrders: Math.round(avgWeeklyOrders * 100) / 100, // Round to 2 decimal places
                totalOrders: orders.length,
                periodInWeeks: weeks
            };
        } catch (error) {
            logger.error(`Error calculating average weekly orders: ${error}`);
            throw new AppError(`Error calculating average weekly orders: ${error}`, 500);
        }
    },

    async getOrdersThisWeek() {
        try {
            // Calculate the start of the current week (Sunday)
            const today = new Date();
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
            startOfWeek.setHours(0, 0, 0, 0); // Start of the day
            
            // Get orders for this week
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startOfWeek
                    }
                },
                select: {
                    id: true,
                    totalAmount: true,
                    orderStatus: true,
                },
            });
            
            // Calculate total revenue
            const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
            
            // Count orders by status
            const processingOrders = orders.filter(order => order.orderStatus === OrderStatus.PROCESSING).length;
            const shippedOrders = orders.filter(order => order.orderStatus === OrderStatus.SHIPPED).length;
            const deliveredOrders = orders.filter(order => order.orderStatus === OrderStatus.DELIVERED).length;
            const cancelledOrders = orders.filter(order => order.orderStatus === OrderStatus.CANCELLED).length;
            
            return {
                totalOrders: orders.length,
                totalRevenue,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                startDate: startOfWeek.toISOString().split('T')[0],
                endDate: today.toISOString().split('T')[0]
            };
        } catch (error) {
            logger.error(`Error fetching orders this week: ${error}`);
            throw new AppError(`Error fetching orders this week: ${error}`, 500);
        }
    }
}