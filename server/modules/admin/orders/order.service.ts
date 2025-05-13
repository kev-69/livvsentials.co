import { OrderStatus } from "@prisma/client";
import { prisma } from "../../../shared/prisma";

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
        });
        return orders;
    },

    // update order status
    async updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
        const order = await prisma.order.update({
            where: { id: orderId },
            data: { orderStatus },
        });
        return order;
    },

    // get order statistics (daily, weekly, monthly sales)
    async getOrderStatistics() {
        const dailySales = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 1)),
                },
            },
        });

        const weeklySales = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7)),
                },
            },
        });

        const monthlySales = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                createdAt: {
                    gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                },
            },
        });

        return { dailySales, weeklySales, monthlySales };
    },
}