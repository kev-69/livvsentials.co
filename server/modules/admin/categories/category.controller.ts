import { Request, Response } from 'express';
import { 
    categoryService
} from './category.service';
import { AppError } from '../../../utils/errors';
import { successResponse, errorResponse } from '../../../utils/response';

export const categoryController = {
    createCategory: async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            const category = await categoryService.createCategory(name, description);
            res.status(201).json(successResponse('Category created successfully', category));
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

    getCategories: async (req: Request, res: Response) => {
        try {
            const categories = await categoryService.getCategories();
            res.status(200).json(successResponse('Categories fetched successfully', categories));
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

    updateCategory: async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.params;
            const categoryData = req.body;
            const updatedCategory = await categoryService.updateCategory(categoryId, categoryData);
            res.status(200).json(successResponse('Category updated successfully', updatedCategory));
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

    deleteCategory: async (req: Request, res: Response) => {
        try {
            const { categoryId } = req.params;
            const deletedCategory = await categoryService.deleteCategory(categoryId);
            res.status(200).json(successResponse('Category deleted successfully', deletedCategory));
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
}