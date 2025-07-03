import { Request, Response } from "express";
import { productService } from "./product.service";
import { AppError } from "../../../utils/errors";
import { errorResponse } from "../../../utils/response";

export const productController = {
    getProducts: async (req: Request, res: Response) => {
        try {
            const products = await productService.getProducts();
            res.status(200).json(products)
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

    getProductBySlug: async (req: Request, res: Response) => {
        const { slug } = req.params;

        try {
            const product = await productService.getProductBySlug(slug);
            res.status(200).json(product);
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