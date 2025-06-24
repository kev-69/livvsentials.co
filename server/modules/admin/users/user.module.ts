import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// ======== USER-RELATED ROUTES ========
/**
 * @route GET /api/admin/users
 * @desc Get all users
 * @access Admin only
*/
router.get('/users',
    userController.getAllUsers
);

/**
 * @route GET /api/admin/users/stats
 * @desc Get user statistics for dashboard
 * @access Admin only
*/
router.get('/users/stats',
    userController.getUserStats
);

/**
 * @route GET /api/admin/users/guest-checkouts
 * @desc Get guest checkout statistics
 * @access Admin only
*/
router.get('/users/guest-checkouts',
    userController.getGuestCheckouts
);

export { router as userRoutes };