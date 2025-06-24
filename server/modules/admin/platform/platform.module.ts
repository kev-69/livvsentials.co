import { Router } from "express";
import { settingsController } from "./platform.controller";
// import { isAuthenticated } from "../../../middleware/auth";

const router = Router();

// Apply authentication middleware to all settings routes
// router.use(isAuthenticated);

// Get all settings
router.get("/", settingsController.getAllSettings);

// Get a specific setting by key
router.get("/:key", settingsController.getSetting);

// Update a specific setting
router.patch("/:key", settingsController.updateSetting);

export { router as platformSettingsRoutes };