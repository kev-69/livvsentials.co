import { Request, Response } from "express";
import { helpServices } from "./help.service";
import { TicketPriority, TicketStatus } from "@prisma/client";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from '../../../utils/response';

export const helpController = {
    getTickets: async (req: Request, res: Response) => {
        try {
            const { status } = req.query;
            const validStatuses = Object.values(TicketStatus);
            
            let filterStatus: TicketStatus | undefined = undefined;
            if (status && validStatuses.includes(status as TicketStatus)) {
                filterStatus = status as TicketStatus;
            }
            
            const tickets = await helpServices.getTickets(filterStatus);
            
            res.status(200).json(successResponse('Successfully feteched tickets', tickets));
        } catch (error) {
             if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    getTicketById: async (req: Request, res: Response) => {
        try {
            const { ticketId } = req.params;
            const ticket = await helpServices.getTicketById(ticketId);
            
            res.status(200).json(successResponse('Successfully fetched ticket', ticket));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    addMessage: async (req: Request, res: Response) => {
        try {
            const { ticketId } = req.params;
            const { content } = req.body;

            // Validate content
            if (!content) {
                throw new AppError("Message content is required", 400);
            }

            // Get admin ID from the authenticated admin
            const adminId = req.user?.id;
            if (!adminId) {
                throw new AppError("Admin ID not found", 401);
            }

            const message = await helpServices.addMessage(ticketId, {
                content,
                adminId
            });
            
            res.status(201).json(successResponse('Message successfully added', message));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    updateTicketStatus: async (req: Request, res: Response) => {
        try {
            const { ticketId } = req.params;
            const { status } = req.body;

            // Validate status
            if (!status) {
                throw new AppError("Status is required", 400);
            }

            const validStatuses = Object.values(TicketStatus);
            if (!validStatuses.includes(status as TicketStatus)) {
                throw new AppError("Invalid status value", 400);
            }

            // Get admin ID from the authenticated admin
            const adminId = req.user?.id;
            if (!adminId) {
                throw new AppError("Admin ID not found", 401);
            }

            const ticket = await helpServices.updateTicketStatus(
                ticketId, 
                status as TicketStatus,
                adminId
            );
            
            res.status(200).json(successResponse('Ticket status successfully updated', ticket));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    updateTicketPriority: async (req: Request, res: Response) => {
        try {
            const { ticketId } = req.params;
            const { priority } = req.body;

            // Validate priority
            if (!priority) {
                throw new AppError("Priority is required", 400);
            }

            const validPriorities = Object.values(TicketPriority);
            if (!validPriorities.includes(priority as TicketPriority)) {
                throw new AppError("Invalid priority value", 400);
            }

            // Get admin ID from the authenticated admin
            const adminId = req.user?.id;
            if (!adminId) {
                throw new AppError("Admin ID not found", 401);
            }

            const ticket = await helpServices.updateTicketPriority(
                ticketId, 
                priority as TicketPriority,
                adminId
            );
            
            res.status(200).json(successResponse('Ticket priority successfully updated', ticket));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    getTicketStats: async (req: Request, res: Response) => {
        try {
            const stats = await helpServices.getTicketStats();
            
            res.status(200).json(successResponse('Tickets stats fetched successfully', stats));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    }
};