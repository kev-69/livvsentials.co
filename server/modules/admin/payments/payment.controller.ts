import { Request, Response } from 'express';
import { paymentService} from './payment.service'
import { AppError } from '../../../utils/errors';
import { errorResponse, successResponse } from '../../../utils/response';

export const paymentController = {
    getAllPayments: async (req: Request, res: Response) => {
        try {
            const payments = await paymentService.getAllPayments()
            res.status(200).json(successResponse('Payments fetched successfully', payments))
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    getProcessingPayments: async (req: Request, res: Response) => {
        try {
            const processingPayments = await paymentService.getProcessingPayments();
            res.status(200).json(successResponse('Processing payments fetched successfully', processingPayments));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    getTotalRevenue: async (req: Request, res: Response) => {
        try {
            const totalRevenue = await paymentService.getTotalRevenue();
            res.status(200).json(successResponse('Total revenue fetched successfully', totalRevenue));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    }
};