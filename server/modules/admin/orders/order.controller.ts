import { orderServices } from "./order.service";
import { Request, Response } from "express";
import { AppError } from "../../../utils/errors";
import { successResponse, errorResponse } from "../../../utils/response";
import { OrderStatus } from "@prisma/client";

export const orderController = {
    getOrders: async (req: Request, res: Response) => {
        try {
            const orders = await orderServices.getOrders();
        res.status(200).json(successResponse("Orders retrieved successfully", orders));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    updateOrderStatus: async (req: Request, res: Response) => {
        try {
            const orderId = req.params.orderId;
            const { orderStatus } = req.body;

            // Validate that orderStatus is a valid enum value
            if (!Object.values(OrderStatus).includes(orderStatus)) {
                res.status(400).json(errorResponse("Invalid order status"));
                return;
            }

            const updatedOrder = await orderServices.updateOrderStatus(orderId, orderStatus as OrderStatus);
            res.status(200).json(successResponse("Order status updated successfully", updatedOrder));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getOrderStatistics: async (req: Request, res: Response) => {
        try {
            const stats = await orderServices.getOrderStatistics();
            
            // Format the results to make them more frontend-friendly
            const formattedStats = {
                daily: stats.dailySales._sum.totalAmount || 0,
                weekly: stats.weeklySales._sum.totalAmount || 0,
                monthly: stats.monthlySales._sum.totalAmount || 0
            };
            
            res.status(200).json(successResponse("Order statistics retrieved successfully", formattedStats));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
        }
    }
};