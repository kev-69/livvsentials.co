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

    // updateOrderStatus: async (req: Request, res: Response) => {
    //     try {
    //         const { orderId } = req.params;
    //         const { orderStatus } = req.body;

    //         // Validate that orderStatus is a valid enum value
    //         if (!Object.values(OrderStatus).includes(orderStatus)) {
    //             return res.status(400).json(errorResponse("Invalid order status"));
    //         }

    //         const updatedOrder = await orderServices.updateOrderStatus(orderId, orderStatus);
    //         res.status(200).json(successResponse(`Order status updated to ${orderStatus}`, updatedOrder));
    //     } catch (error) {
    //         handleControllerError(error, res);
    //     }
    // },
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