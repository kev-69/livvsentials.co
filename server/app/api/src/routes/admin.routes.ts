import { Router } from "express";
import { adminRoutes } from "../../../../modules/admin/admin.modules";
import { validateToken } from "../../../../middlewares/user.middleware";
// import { isAdmin } from "../../../../modules/admin/admin.middleware";

const router = Router();

router.use('/', 
    validateToken,
    adminRoutes
);

export { router as adminRoutes };