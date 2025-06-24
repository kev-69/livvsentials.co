import { prisma } from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

export const paymentService = {
    async getAllPayments() {
        try {
            const payments = await prisma.payment.findMany({
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            const transformedPayments = payments.map(payment => ({
                id: payment.id,
                paymentId: `TRX-${payment.id.substring(0, 4).toUpperCase()}`,
                customer: {
                    id: payment.order.user.id,
                    firstName: payment.order.user.firstName,
                    lastName: payment.order.user.lastName,
                    email: payment.order.user.email,
                },
                date: payment.createdAt,
                paymentMethod: payment.paymentMethod,
                orderId: payment.orderId,
                orderNumber: payment.order.orderNumber,
                status: payment.paymentStatus,
                amount: payment.amount,
            }));
          
            return transformedPayments;
        } catch (error) {
            console.error(`Error fetching payments: ${error}`);
            throw new Error(`Error fetching payments: ${error}`);
        }
    },

    async getTotalRevenue() {
        try {
            // Get the sum of all completed payments
            const result = await prisma.payment.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    paymentStatus: PaymentStatus.COMPLETED
                }
            });

            const totalRevenue = result._sum.amount || 0;

            // Get additional revenue statistics
            const totalOrders = await prisma.payment.count({
                where: {
                    paymentStatus: PaymentStatus.COMPLETED
                }
            });

            const averageOrderValue = totalOrders > 0 
                ? totalRevenue / totalOrders 
                : 0;

            // Get the current month's revenue
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            const currentMonthResult = await prisma.payment.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    paymentStatus: PaymentStatus.COMPLETED,
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });

            const currentMonthRevenue = currentMonthResult._sum.amount || 0;

            // Get last month's revenue for comparison
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

            const lastMonthResult = await prisma.payment.aggregate({
                _sum: {
                    amount: true
                },
                where: {
                    paymentStatus: PaymentStatus.COMPLETED,
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth
                    }
                }
            });

            const lastMonthRevenue = lastMonthResult._sum.amount || 0;

            // Calculate month-over-month growth percentage
            let growthRate = 0;
            if (lastMonthRevenue > 0) {
                growthRate = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
            }

            return {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                currentMonthRevenue,
                lastMonthRevenue,
                growthRate,
                currency: 'GHS'
            };
        } catch (error) {
            console.error(`Error calculating total revenue: ${error}`);
            throw new Error(`Error calculating total revenue: ${error}`);
        }
    },

    async getProcessingPayments() {
        try {
            // Get the sum of all payments that are in processing status
            const result = await prisma.payment.aggregate({
                _sum: {
                    amount: true
                },
                _count: {
                    id: true
                },
                where: {
                    paymentStatus: PaymentStatus.PROCESSING
                }
            });

            // Get the processing payments with details
            const processingPayments = await prisma.payment.findMany({
                where: {
                    paymentStatus: PaymentStatus.PROCESSING
                },
                include: {
                    order: {
                        select: {
                            orderNumber: true,
                            orderStatus: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            // Transform the payment data for frontend
            const transformedPayments = processingPayments.map(payment => ({
                id: payment.id,
                paymentId: `TRX-${payment.id.substring(0, 4).toUpperCase()}`,
                customer: {
                    id: payment.order.user.id,
                    firstName: payment.order.user.firstName,
                    lastName: payment.order.user.lastName,
                    email: payment.order.user.email,
                },
                date: payment.createdAt,
                paymentMethod: payment.paymentMethod,
                orderId: payment.orderId,
                orderNumber: payment.order.orderNumber,
                orderStatus: payment.order.orderStatus,
                status: payment.paymentStatus,
                amount: payment.amount,
            }));

            return {
                totalProcessingAmount: result._sum.amount || 0,
                count: result._count.id || 0,
                currency: 'GHS',
                payments: transformedPayments
            };
        } catch (error) {
            console.error(`Error fetching processing payments: ${error}`);
            throw new Error(`Error fetching processing payments: ${error}`);
        }
    },
};