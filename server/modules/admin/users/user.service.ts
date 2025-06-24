import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";

export const userServices = {
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    createdAt: true,
                    updatedAt: true,
                    orders: {
                        select: {
                            id: true,
                            totalAmount: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            const transformedUsers = users.map(user => {
                const totalSpent = user.orders.reduce((sum, order) => sum + order.totalAmount, 0);
                
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    orders: {
                        count: user.orders.length,
                        totalSpent,
                    },
                };
            });
            return transformedUsers;
        } catch (error) {
            logger.error(`Error fetching users: ${error}`);
            throw new Error(`Error fetching users: ${error}`);
        }
    },

    async getUserStats() {
        try {
            // Count total registered users
            const totalUsers = await prisma.user.count();
            
            // Get the current month's new users
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            
            const currentMonthUsers = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                        lte: endOfMonth
                    }
                }
            });
            
            // Get last month's new users for growth calculation
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
            
            const lastMonthUsers = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth
                    }
                }
            });
            
            // Calculate growth percentage
            let growthRate = 0;
            if (lastMonthUsers > 0) {
                growthRate = ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
            }
            
            return {
                totalCustomers: totalUsers,
                newCustomersThisMonth: currentMonthUsers,
                lastMonthCustomers: lastMonthUsers,
                growthRate
            };
        } catch (error) {
            logger.error(`Error fetching user statistics: ${error}`);
            throw new Error(`Error fetching user statistics: ${error}`);
        }
    },

    async getGuestCheckouts() {
        try {
            // Count orders with guestCheckout = true
            const totalGuestOrders = await prisma.order.count({
                where: {
                    guestCheckout: true
                }
            });
            
            // Count total orders
            const totalOrders = await prisma.order.count();
            
            // Calculate percentage
            const percentage = totalOrders > 0 
                ? (totalGuestOrders / totalOrders) * 100 
                : 0;
            
            return {
                totalGuestOrders,
                totalOrders,
                percentage
            };
        } catch (error) {
            logger.error(`Error fetching guest checkout statistics: ${error}`);
            throw new Error(`Error fetching guest checkout statistics: ${error}`);
        }
    },
}