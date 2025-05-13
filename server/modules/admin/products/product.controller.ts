import { Request, Response } from "express";
import { productService } from "./product.service";
import { AppError } from "../../../utils/errors";
import { successResponse, errorResponse } from "../../../utils/response";

export const productController = {
    addProduct: async (req: Request, res: Response) => {
        try {
            const productData = req.body;
            const files = req.files as Express.Multer.File[];
            const product = await productService.addProduct({ ...productData, files });
            
            res.status(201).json(
                successResponse('Product created successfully', product)
            );
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

    getProducts: async (req: Request, res: Response) => {
        try {
            const products = await productService.getProducts();
            res.status(200).json(successResponse("Products retrieved successfully", products));
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

    updateProduct: async (req: Request, res: Response) => {
        try {
            const productId = req.params.productId;
            const productData = req.body;
            const files = req.files as Express.Multer.File[];
            const product = await productService.updateProduct(productId, { ...productData, files });
            
            res.status(200).json(
                successResponse('Product updated successfully', product)
            );
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

    deleteProduct: async (req: Request, res: Response) => {
        try {
            const productId = req.params.productId;
            await productService.deleteProduct(productId);
            res.status(200).json(successResponse("Product deleted successfully"));
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
};