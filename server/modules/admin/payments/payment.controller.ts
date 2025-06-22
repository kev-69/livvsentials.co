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
    }
}