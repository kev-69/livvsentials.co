import { prisma } from "../../../shared/prisma";

export const paymentService = {
    async getAllPayments () {
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
            paymentId:`TRX-${payment.id.substring(0, 4).toUpperCase()}`,
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

    },

    async getPendingPayments() {

    },

    async getRefundRate() {
        
    },
}