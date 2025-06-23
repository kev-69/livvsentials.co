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
            handleControllerError(error, res);
        }
    },

    getOrderById: async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const order = await orderServices.getOrderById(orderId);
            res.status(200).json(successResponse("Order retrieved successfully", order));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    shipOrder: async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const updatedOrder = await orderServices.shipOrder(orderId);
            res.status(200).json(successResponse("Order marked as shipped", updatedOrder));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    cancelOrder: async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const updatedOrder = await orderServices.cancelOrder(orderId);
            res.status(200).json(successResponse("Order cancelled successfully", updatedOrder));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    deliverOrder: async (req: Request, res: Response) => {
        try {
            const { orderId } = req.params;
            const updatedOrder = await orderServices.deliverOrder(orderId);
            res.status(200).json(successResponse("Order marked as delivered", updatedOrder));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    getPendingOrders: async (req: Request, res: Response) => {
        try {
            const pendingOrders = await orderServices.getPendingOrders()
            res.status(200).json(successResponse("Pending order fetched successfully", pendingOrders))
        } catch (error) {
            handleControllerError(error, res)
        }
    },

    getOrdersChart: async (req: Request, res: Response) => {
        try {
            const stats = await orderServices.getOrdersChart();
            res.status(200).json(successResponse("Order statistics retrieved successfully", stats));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    getAvgWeeklyOrders: async (req: Request, res: Response) => {
        try {
            const weeklyOrders = await orderServices.getAvgWeeklyOrders();
            res.status(200).json(successResponse("Average weekly orders retrieved successfully", weeklyOrders));
        } catch (error) {
            handleControllerError(error, res);
        }
    },

    getOrdersThisWeek: async (req: Request, res: Response) => {
        try {
            const weeklyOrders = await orderServices.getOrdersThisWeek();
            res.status(200).json(successResponse("Weekly orders retrieved successfully", weeklyOrders));
        } catch (error) {
            handleControllerError(error, res);
        }
    }
};

// Helper function for consistent error handling
function handleControllerError(error: unknown, res: Response) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json(errorResponse(error.message));
    } else if (error instanceof Error) {
        return res.status(400).json(errorResponse(error.message));
    } else {
        return res.status(500).json(errorResponse("An unexpected error occurred"));
    }
}