import { Request, Response } from 'express';
import { categoryService } from './category.service';
import { AppError } from '../../../utils/errors';
import { errorResponse } from '../../../utils/response';

export const categoryController = {
    async getCategories(req: Request, res: Response) {
        try {
            const categories = await categoryService.getCategories();
            res.status(200).json(categories);
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

    async getCategoryById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const category = await categoryService.getCategoryById(id);
            res.status(200).json(category);
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