import { AnalyticServices } from "./analytics.service";
import { Request, Response } from "express";
import { AppError } from "../../../utils/errors";
import { successResponse, errorResponse } from "../../../utils/response";
import { prisma } from "../../../shared/prisma";

export const analyticsController = {
    // Get dashboard overview with multiple metrics at once
    getDashboardOverview: async (req: Request, res: Response) => {
        try {
            // Get all data in parallel for better performance
            const [
                totalSalesData,
                avgWeeklyOrderData,
                topSellingData,
                userCount
            ] = await Promise.all([
                AnalyticServices.getTotalSales(),
                AnalyticServices.getAvgWeeklyOrder(),
                AnalyticServices.getTopSelling(5),
                prisma.user.count()
            ]);

            // Combine all data into a single dashboard object
            const dashboardData = {
                totalSales: totalSalesData.totalSales,
                avgWeeklyOrders: avgWeeklyOrderData.avgOrdersPerWeek,
                topSellingProducts: topSellingData,
                userCount,
                recentActivity: {
                    weeklyOrderBreakdown: avgWeeklyOrderData.weeklyBreakdown
                }
            };

            res.status(200).json(successResponse("Dashboard data retrieved successfully", dashboardData));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    // Get users with their order information
    getUsers: async (req: Request, res: Response) => {
        try {
            const users = await AnalyticServices.getUsers();
            res.status(200).json(successResponse("Users retrieved successfully", users));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    // Get total sales amount
    getTotalSales: async (req: Request, res: Response) => {
        try {
            const totalSales = await AnalyticServices.getTotalSales();
            res.status(200).json(successResponse("Total sales retrieved successfully", totalSales));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    // Get average weekly orders
    getAvgWeeklyOrder: async (req: Request, res: Response) => {
        try {
            const avgWeeklyOrder = await AnalyticServices.getAvgWeeklyOrder();
            res.status(200).json(successResponse("Average weekly orders retrieved successfully", avgWeeklyOrder));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    // Get top selling products
    getTopSelling: async (req: Request, res: Response) => {
        try {
            // Extract limit from query params or use default
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
            
            const topSelling = await AnalyticServices.getTopSelling(limit);
            res.status(200).json(successResponse("Top selling products retrieved successfully", topSelling));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    // Get detailed order statistics
    getOrderStatistics: async (req: Request, res: Response) => {
        try {
            const orderStats = await AnalyticServices.getOrderStatistics();
            res.status(200).json(successResponse("Order statistics retrieved successfully", orderStats));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    // Custom period sales report
    getSalesReport: async (req: Request, res: Response) => {
        try {
            // Extract date range from request query params
            const { startDate, endDate } = req.query;
            
            if (!startDate || !endDate) {
                res.status(400).json(errorResponse("Start date and end date are required"));
                return;
            }
            
            // Validate and parse dates
            const parsedStartDate = new Date(startDate as string);
            const parsedEndDate = new Date(endDate as string);
            
            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                res.status(400).json(errorResponse("Invalid date format"));
                return;
            }
            
            // Query sales data for the specified period
            const salesData = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: parsedStartDate,
                        lte: parsedEndDate
                    },
                    orderStatus: {
                        not: 'CANCELLED'
                    }
                },
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            });
            
            // Calculate total revenue for the period
            const totalRevenue = salesData.reduce((sum, order) => sum + order.totalAmount, 0);
            
            // Format the data for response
            const reportData = {
                period: {
                    from: parsedStartDate.toISOString().split('T')[0],
                    to: parsedEndDate.toISOString().split('T')[0]
                },
                totalOrders: salesData.length,
                totalRevenue,
                orders: salesData.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    date: order.createdAt,
                    amount: order.totalAmount,
                    status: order.orderStatus,
                    items: order.orderItems.length
                }))
            };
            
            res.status(200).json(successResponse("Sales report generated successfully", reportData));
        } catch (error) {
            handleControllerError(error, res);
        }
    }
};

// Helper function to handle controller errors consistently
function handleControllerError(error: unknown, res: Response) {
    console.error("Analytics controller error:", error);
    
    if (error instanceof AppError) {
        return res.status(error.statusCode).json(errorResponse(error.message));
    } else if (error instanceof Error) {
        return res.status(400).json(errorResponse(error.message));
    } else {
        return res.status(500).json(errorResponse("An unexpected error occurred"));
    }
}