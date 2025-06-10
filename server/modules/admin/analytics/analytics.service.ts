import { prisma } from "../../../shared/prisma";
import { getWeekNumber } from "../../../utils/helpers"
import { formatDate } from "../../../utils/helpers";

export const AnalyticServices = {
    async getUsers() {
        const users = await prisma.user.findMany({
            include: {
                orders: {
                    include: {
                        orderItems: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        })
        return users
    },

    async getTotalSales() {
        const totalSales = await prisma.order.aggregate({
            _sum: {
                totalAmount: true,
            },
            where: {
                orderStatus: {
                    not: 'CANCELLED',
                },
            },
        });

        return {
            totalSales: totalSales._sum.totalAmount || 0,
        };
    },

    async getAvgWeeklyOrder() {
        // Get orders from the last 4 weeks
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: fourWeeksAgo,
                },
                orderStatus: {
                    not: 'CANCELLED',
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Group orders by week
        const weeklyOrders: { [key: string]: number } = {};
        orders.forEach(order => {
            const weekNumber = getWeekNumber(order.createdAt);
            const weekKey = `Week ${weekNumber}`;
            
            if (!weeklyOrders[weekKey]) {
                weeklyOrders[weekKey] = 0;
            }
            weeklyOrders[weekKey]++;
        });

        // Calculate average
        const weeks = Object.keys(weeklyOrders);
        const totalOrders = Object.values(weeklyOrders).reduce((sum, count) => sum + count, 0);
        const avgOrdersPerWeek = weeks.length > 0 ? totalOrders / weeks.length : 0;

        return {
            avgOrdersPerWeek: Math.round(avgOrdersPerWeek * 100) / 100, // Round to 2 decimal places
            weeklyBreakdown: weeklyOrders,
        };
    },

    async getTopSelling(limit = 5) {
        // Get top selling products based on order items
        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: limit,
        });

        // Get full product details
        const productIds = topProducts.map(item => item.productId);
        const productDetails = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            include: {
                category: true,
            },
        });

        // Combine quantity data with product details
        return topProducts.map(item => {
            const product = productDetails.find(p => p.id === item.productId);
            return {
                product,
                totalQuantitySold: item._sum.quantity || 0,
            };
        });
    },

    // async getTopSeller(limit = 5) {
    //     // Get top sellers (categories with most sales)
    //     const topCategories = await prisma.orderItem.groupBy({
    //         by: ['product.categoryId'],
    //         _sum: {
    //             quantity: true,
    //         },
    //         orderBy: {
    //             _sum: {
    //                 quantity: 'desc',
    //             },
    //         },
    //         take: limit,
    //     });

    //     // Get full category details
    //     const categoryIds = topCategories.map(item => item.product.categoryId);
    //     const categoryDetails = await prisma.category.findMany({
    //         where: {
    //             id: {
    //                 in: categoryIds,
    //             },
    //         },
    //     });

    //     // Combine quantity data with category details
    //     return topCategories.map(item => {
    //         const category = categoryDetails.find(c => c.id === item.product.categoryId);
    //         return {
    //             category,
    //             totalQuantitySold: item._sum.quantity || 0,
    //         };
    //     });
    // },

    async getOrderStatistics() {
        // Daily sales (last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        // Weekly sales (last 4 weeks)
        const last4Weeks = new Date();
        last4Weeks.setDate(last4Weeks.getDate() - 28);

        // Monthly sales (last 6 months)
        const last6Months = new Date();
        last6Months.setMonth(last6Months.getMonth() - 6);

        // Get daily sales
        const dailySales = await prisma.order.groupBy({
            by: ['createdAt'],
            _sum: {
                totalAmount: true,
            },
            where: {
                createdAt: {
                    gte: last7Days,
                },
                orderStatus: {
                    not: 'CANCELLED',
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        // Format daily data
        const formattedDailySales = dailySales.map(day => ({
            date: formatDate(day.createdAt),
            sales: day._sum.totalAmount || 0,
        }));

        // Get weekly sales
        const weeklySales = await prisma.$queryRaw`
            SELECT 
                DATE_TRUNC('week', "createdAt") as week,
                SUM("totalAmount") as total
            FROM "Order"
            WHERE "createdAt" >= ${last4Weeks}
            AND "orderStatus" != 'CANCELLED'
            GROUP BY DATE_TRUNC('week', "createdAt")
            ORDER BY week ASC
        `;

        // Get monthly sales
        const monthlySales = await prisma.$queryRaw`
            SELECT 
                DATE_TRUNC('month', "createdAt") as month,
                SUM("totalAmount") as total
            FROM "Order"
            WHERE "createdAt" >= ${last6Months}
            AND "orderStatus" != 'CANCELLED'
            GROUP BY DATE_TRUNC('month', "createdAt")
            ORDER BY month ASC
        `;

        return {
            daily: formattedDailySales,
            weekly: weeklySales,
            monthly: monthlySales,
        };
    }
};