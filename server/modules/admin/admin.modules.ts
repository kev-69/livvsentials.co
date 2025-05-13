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

import { loginAdmin } from "./auth/auth.controller";

// categories
import { categoryController } from "./categories/category.controller";
import { createCategorySchema, updateCategorySchema } from "./categories/category.schema";
// products
import { productController } from "./products/product.controller";
import { addProductFormSchema, updateProductFormSchema } from "./products/product.schema";
// orders
import { orderController } from "./orders/order.controller";

// import middlewares
import { isAdmin, validateToken } from "./admin.middleware";
import { validateRequest } from "./admin.middleware";

const router = Router();

router.post('/login',
    loginAdmin
)

// other admin routes
// ======== CATEGORY-RELATED ROUTES ========
/**
 * @route GET /api/admin/categories/
 * @desc Get all categories
 * @access Admin only
 */
router.get('/categories', 
    validateToken,
    isAdmin,
    categoryController.getCategories
);

/**
 * @route POST /api/admin/categories/
 * @desc Create a new categories
 * @access Admin only
 */
router.post('/categories', 
    validateToken,
    isAdmin,
    validateRequest({
        body: createCategorySchema,
    }),
    categoryController.createCategory
);

/**
 * @route PATCH /api/admin/categories/:categoryId
 * @desc Update a categories
 * @access Admin only
 */
router.patch('/categories/:categoryId', 
    validateToken,
    isAdmin,
    validateRequest({
        params: z.object({ categoryId: z.string().uuid() }),
        body: updateCategorySchema.omit({ categoryId: true }),
    }),
    categoryController.updateCategory
);

/**
 * @route DELETE /api/admin/categories/:categoryId
 * @desc Delete a category
 * @access Admin only
 */
router.delete('/categories/:categoryId', 
    validateToken,
    isAdmin,
    validateRequest({
        params: z.object({ categoryId: z.string().uuid() }),
    }),
    categoryController.deleteCategory
);

// ======== PRODUCT-RELATED ROUTES ========
/**
 * @route GET /api/admin/products/
 * @desc Get all products
 * @access Admin only
 */
router.get('/products',
    validateToken,
    isAdmin,
    productController.getProducts
);

/**
 * @route POST /api/admin/products/:productId
 * @desc Add a product by ID
 * @access Admin only
 */
router.post('/products',
    validateToken,
    isAdmin,
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
router.patch('/products/:productId',
    validateToken,
    isAdmin,
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
router.delete('/products/:productId',
    validateToken,
    isAdmin,
    validateRequest({
        params: z.object({ productId: z.string().uuid() }),
    }),
    productController.deleteProduct
);

// ======== ORDER-RELATED ROUTES ========
/**
 * @route GET /api/admin/orders/
 * @desc Get all orders
 * @access Admin only
 */
router.get('/orders',
    validateToken,
    isAdmin,
    orderController.getOrders
);

/**
 * @route PATCH /api/admin/orders/:orderId
 * @desc Update order status by ID
 * @access Admin only
 */
router.patch('/orders/:orderId',
    validateToken,
    isAdmin,
    validateRequest({
        params: z.object({ orderId: z.string().uuid() }),
        body: z.object({ orderStatus: z.enum(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]) }),
    }),
    orderController.updateOrderStatus
);

/**
 * @route GET /api/admin/orders/statistics
 * @desc Get orders statistics
 * @access Admin only
 */
router.get('/orders/statistics',
    validateToken,
    isAdmin,
    orderController.getOrderStatistics
);


export { router as adminRoutes };