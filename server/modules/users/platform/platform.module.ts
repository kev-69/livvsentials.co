import { Router } from "express";
import { platformController } from "./platform.controller";

const router = Router();

router.get("/:key", platformController.getSetting);

export { router as getSettingsRoutes };