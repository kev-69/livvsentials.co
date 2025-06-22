import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// ======== USER-RELATED ROUTES ========
router.get('/users',
    userController.getAllUsers
)

export { router as userRoutes };