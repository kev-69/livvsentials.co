import { Router } from "express";

import { loginAdmin } from "../auth/auth.controller";
import { fetchAdminProfile } from "../auth/auth.controller";

import { isAdmin, validateToken } from "../../../middlewares/admin.middleware";

const router = Router();

router.post('/login',
    loginAdmin
)

router.get('/profile',
    validateToken,
    isAdmin,
    fetchAdminProfile
)

export { router as authRoutes };

// Get order stats (total, weekly, etc.)
// Get order chart data (date, count)
// Get customer stats (total, guest, growth)
// Get customer growth data (for chart)
// Get payment stats (total, pending, refund)
// Get recent activity feed