import { Router } from "express";
import { z } from 'zod'

import { orderController } from "./order.controller";

// import middlewares
import { validateRequest } from "../../../middlewares/admin.middleware";


const router = Router();

// ======== ORDER-RELATED ROUTES ========
/**
 * @route GET /api/admin/orders/
 * @desc Get all orders
 * @access Admin only
*/
router.get('/orders',
    orderController.getOrders
);

/**
 * @route GET /api/admin/orders/stats
 * @desc Get order chart data
 * @access Admin only
*/
router.get('/orders/stats',
    orderController.getOrdersChart
);

/**
 * @route GET /api/admin/orders/stats/this-week
 * @desc Get orders for this week
 * @access Admin only
*/
router.get('/orders/stats/this-week',
    orderController.getOrdersThisWeek
);

/**
 * @route GET /api/admin/orders/stats/avg-weekly
 * @desc Get average weekly orders
 * @access Admin only
*/
router.get('/orders/stats/avg-weekly',
    orderController.getAvgWeeklyOrders
);

/**
 * @route GET /api/admin/orders/pending
 * @desc Get pending orders
 * @access Admin only
*/
router.get('/orders/pending',
    orderController.getPendingOrders
);

/**
 * @route GET /api/admin/orders/:orderId
 * @desc Get a particular order with ID
 * @access Admin only
*/
router.get('/orders/:orderId',
    validateRequest({
        params: z.object({ orderId: z.string().uuid() }),
    }),
    orderController.getOrderById
);

/**
 * @route POST /api/admin/orders/:orderId/ship
 * @desc Update order status to shipped using ID
 * @access Admin only
*/
router.post('/order/:orderId/ship',
    validateRequest({
        params: z.object({ orderId: z.string().uuid() }),
    }),
    orderController.shipOrder
);

/**
 * @route POST /api/admin/orders/:orderId/cancel
 * @desc Update order status to cancelled using ID
 * @access Admin only
*/
router.post('/order/:orderId/cancel',
    validateRequest({
        params: z.object({ orderId: z.string().uuid() }),
    }),
    orderController.cancelOrder
);

/**
 * @route POST /api/admin/orders/:orderId/deliver
 * @desc Update order status to delivered using ID
 * @access Admin only
*/
router.post('/order/:orderId/deliver',
    validateRequest({
        params: z.object({ orderId: z.string().uuid() }),
    }),
    orderController.deliverOrder
);

export { router as orderRoutes };