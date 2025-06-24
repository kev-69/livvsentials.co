import { Router } from "express";
import { z } from 'zod'
import multer from "multer";

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ storage });

import { productController } from "./product.controller";

import { addProductFormSchema, updateProductFormSchema } from "./product.schema";

// import middlewares
import { validateRequest } from "../../../middlewares/admin.middleware";

const router = Router();

// ======== PRODUCT-RELATED ROUTES ========
/**
 * @route GET /api/admin/products/
 * @desc Get all products
 * @access Admin only
*/
router.get('/products',
    productController.getProducts
);

/**
 * @route GET /api/admin/product/top-seller
 * @desc Get the top selling product
 * @access Admin only
*/
router.get('/products/top-seller',
    productController.getTopSellingProduct
);

/** * @route GET /api/admin/products/top-selling
 * @desc Get the top selling products
 * @access Admin only
*/
router.get('/products/top-selling',
    productController.topSellingProducts
)

/**
 * @route POST /api/admin/product
 * @desc Add a product by ID
 * @access Admin only
*/
router.post('/product',
    upload.array('productImages', 5), // Limit to 5 images
    validateRequest({
        body: addProductFormSchema,
    }),
    productController.addProduct
);

/**
 * @route PATCH /api/admin/products/:productId
 * @desc Update a product by ID
 * @access Admin only
*/
router.patch('/product/:productId',
    upload.array('productImages', 5), // Limit to 5 images
    validateRequest({
        params: z.object({ productId: z.string().uuid() }),
        body: updateProductFormSchema,
    }),
    productController.updateProduct
);

/**
 * @route DELETE /api/admin/products/:productId
 * @desc Delete a product by ID
 * @access Admin only
*/
router.delete('/product/:productId',
    validateRequest({
        params: z.object({ productId: z.string().uuid() }),
    }),
    productController.deleteProduct
);

export { router as productRoutes };