import { Router } from "express";
import { settingsController } from "./platform.controller";

const router = Router();

// General settings routes
router.get("/", settingsController.getAllSettings);

router.get("/:key", settingsController.getSetting);

router.patch("/:key", settingsController.updateSetting);

export { router as platformSettingsRoutes };