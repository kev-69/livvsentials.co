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

export { router as paymentRoutes };