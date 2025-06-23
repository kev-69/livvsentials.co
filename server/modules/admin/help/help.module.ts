import { Router } from "express";
import { helpController } from "./help.controller";
// import { isAuthenticated } from "../../../middleware/auth";

const router = Router();

// Apply authentication middleware to all help center routes
// router.use(isAuthenticated);

// Get ticket statistics
router.get("/stats", helpController.getTicketStats);

// Get all tickets with optional status filter
router.get("/", helpController.getTickets);

// Get a specific ticket by ID
router.get("/:ticketId", helpController.getTicketById);

// Add a message to a ticket
router.post("/:ticketId/messages", helpController.addMessage);

// Update ticket status
router.patch("/:ticketId/status", helpController.updateTicketStatus);

// Update ticket priority
router.patch("/:ticketId/priority", helpController.updateTicketPriority);

export { router as helpRoutes };