import { Request, Response } from "express";
import { orderService } from "./order.service";
import { AppError } from "../../../utils/errors";
import { errorResponse } from "../../../utils/response";

export const orderController = {
    getUserOrders: async (req: Request, res: Response) => {
        try {
            const userId = req.user?.userId;
            const orders = await orderService.getUserOrders(userId);
            res.status(200).json(orders);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    },

    getOrderById: async (req: Request, res: Response) => {
        try {
            const orderId = req.params.id;
            const order = await orderService.getOrderById(orderId);
            if (!order) {
                throw new AppError('Order not found', 404);
            }
            res.status(200).json(order);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else {
                res.status(500).json({ message: 'An unknown error occurred' });
            }
        }
    },
}