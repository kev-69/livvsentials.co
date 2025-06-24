import { Router } from "express";
import { z } from 'zod'
import { paymentController } from "./payment.controller";

const router = Router();

// ======== PAYMENT-RELATED ROUTES ========
/**
 * @route GET /api/admin/payments/
 * @desc Get all categories
 * @access Admin only
*/
router.get('/payments', 
    paymentController.getAllPayments
);

/**
 * @route GET /api/admin/payments/revenue
 * @desc Get total revenue statistics
 * @access Admin only
*/
router.get('/payments/revenue', 
    paymentController.getTotalRevenue
);

/**
 * @route GET /api/admin/payments/processing
 * @desc Get all processing payments
 * @access Admin only
*/
router.get('/payments/processing', 
    paymentController.getProcessingPayments
);

export { router as paymentRoutes };