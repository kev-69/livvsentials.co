import { Router } from "express";

// analytics
import { analyticsController } from "./analytics.controller";

// import middlewares
import { isAdmin, validateToken } from "../../../middlewares/admin.middleware";


const router = Router();


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

// Get order stats (total, weekly, etc.)
// Get order chart data (date, count)
// Get customer stats (total, guest, growth)
// Get customer growth data (for chart)
// Get payment stats (total, pending, refund)
// Get recent activity feed