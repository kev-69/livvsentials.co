import { Router } from "express";
import { adminRoutes } from "../../../../modules/admin/admin.modules";

const router = Router();

router.use('/', 
    adminRoutes
);

export { router as adminRoutes };