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

// analytics
import { analyticsController } from "./analytics/analytics.controller";
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
 * @route GET /api/admin/orders/orderId
 * @desc Get a particular order with ID
 * @access Admin only
*/
router.get('/orders/:orderId',
    validateToken,
    isAdmin,
    orderController.getOrderById
)

/**
 * @route POST /api/admin/orders/:orderId
 * @desc Update order status to shipped using ID
 * @access Admin only
*/
router.post('/orders/:orderId',
    validateToken,
    isAdmin,
    orderController.shipOrder
);

/**
 * @route POST /api/admin/orders/:orderId
 * @desc Update order status to cancelled using ID
 * @access Admin only
*/
router.post('orders/orderId',
    validateToken,
    isAdmin,
    orderController.cancelOrder
)

/**
 * @route POST /api/admin/orders/:orderId
 * @desc Update order status to delivered using ID
 * @access Admin only
*/
router.post('/orders/orderId',
    validateToken,
    isAdmin,
    orderController.deliverOrder
)

// ======== ANALYTICS-RELATED ROUTES ========
/**
 * @route GET /api/admin/analytics/dashboard
 * @desc Get dashboard overview with analytics data
 * @access Admin only
*/
router.get('/analytics/dashboard', 
    validateToken,
    isAdmin, 
    analyticsController.getDashboardOverview
);

/**
 * @route GET /api/admin/analytics/users
 * @desc Get users with their order information
 * @access Admin only
*/
router.get('/analytics/users', 
    validateToken,
    isAdmin, 
    analyticsController.getUsers
);

/**
 * @route GET /api/admin/analytics/sales
 * @desc Get total sales amount
 * @access Admin only
*/
router.get('/analytics/sales', 
    validateToken,
    isAdmin, 
    analyticsController.getTotalSales
);

/**
 * @route GET /api/admin/analytics/weekly-orders
 * @desc Get weekly order statistics including average orders per week and breakdown
 * @access Admin only
*/
router.get('/analytics/weekly-orders', 
    validateToken,
    isAdmin, 
    analyticsController.getAvgWeeklyOrder
);

/**
 * @route GET /api/admin/analytics/top-selling
 * @desc Get top seller product data
 * @access Admin only
*/
router.get('/analytics/top-selling', 
    validateToken,
    isAdmin, 
    analyticsController.getTopSelling
);

/**
 * @route GET /api/admin/analytics/order-statistics
 * @desc Get order statistics
 * @access Admin only
*/
router.get('/analytics/order-statistics', 
    validateToken,
    isAdmin, 
    analyticsController.getOrderStatistics
);

/**
 * @route GET /api/admin/analytics/sales-report
 * @desc Get sales report using start and end date
 * @access Admin only
*/
router.get('/analytics/sales-report', 
    validateToken,
    isAdmin, 
    analyticsController.getSalesReport
);

export { router as adminRoutes };