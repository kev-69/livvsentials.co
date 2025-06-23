import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";
import { SenderType, TicketPriority, TicketStatus } from "@prisma/client";
// import { v4 as uuidv4 } from 'uuid';

export const helpServices = {
    async getTickets(filterStatus?: TicketStatus) {
        try {
            const whereClause = filterStatus ? { status: filterStatus } : {};
            
            const tickets = await prisma.supportTicket.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    order: {
                        select: {
                            id: true,
                            orderNumber: true,
                        }
                    },
                    messages: {
                        orderBy: {
                            createdAt: 'asc',
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            },
                            admin: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc',
                }
            });

            return tickets;
        } catch (error) {
            logger.error(`Error fetching support tickets: ${error}`);
            throw new AppError(`Error fetching support tickets: ${error}`, 500);
        }
    },

    async getTicketById(ticketId: string) {
        try {
            const ticket = await prisma.supportTicket.findUnique({
                where: { id: ticketId },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    order: {
                        select: {
                            id: true,
                            orderNumber: true,
                        }
                    },
                    messages: {
                        orderBy: {
                            createdAt: 'asc',
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            },
                            admin: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        }
                    }
                }
            });

            if (!ticket) {
                throw new AppError("Support ticket not found", 404);
            }

            return ticket;
        } catch (error) {
            logger.error(`Error fetching support ticket: ${error}`);
            throw new AppError(`Error fetching support ticket: ${error}`, 500);
        }
    },

    async addMessage(ticketId: string, messageData: {
        content: string;
        adminId: string;
    }) {
        try {
            // Check if ticket exists
            const ticket = await prisma.supportTicket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                throw new AppError("Support ticket not found", 404);
            }

            // Create message
            const message = await prisma.ticketMessage.create({
                data: {
                    ticketId,
                    content: messageData.content,
                    senderType: SenderType.ADMIN,
                    adminId: messageData.adminId,
                },
                include: {
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        }
                    }
                }
            });

            // Update ticket status to PENDING if it was OPEN
            if (ticket.status === TicketStatus.OPEN) {
                await prisma.supportTicket.update({
                    where: { id: ticketId },
                    data: { status: TicketStatus.PENDING }
                });
            }

            // Update the ticket's updatedAt timestamp
            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { updatedAt: new Date() }
            });

            return message;
        } catch (error) {
            logger.error(`Error adding message to ticket: ${error}`);
            throw new AppError(`Error adding message to ticket: ${error}`, 500);
        }
    },

    async updateTicketStatus(ticketId: string, status: TicketStatus, adminId: string) {
        try {
            // Check if ticket exists
            const ticket = await prisma.supportTicket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                throw new AppError("Support ticket not found", 404);
            }

            // If resolving a ticket, set resolvedAt timestamp
            const updateData: any = { 
                status,
                adminId // Assign the admin who is updating the status
            };

            if (status === TicketStatus.RESOLVED) {
                updateData.resolvedAt = new Date();
            } else {
                // If reopening a resolved ticket, clear the resolvedAt field
                updateData.resolvedAt = null;
            }

            // Update ticket status
            const updatedTicket = await prisma.supportTicket.update({
                where: { id: ticketId },
                data: updateData,
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    }
                }
            });

            // Add a system message about the status change
            const statusChangeMessage = status === TicketStatus.RESOLVED
                ? "Ticket has been marked as resolved"
                : status === TicketStatus.OPEN
                    ? "Ticket has been reopened"
                    : "Ticket status has been updated to " + status.toLowerCase();

            await prisma.ticketMessage.create({
                data: {
                    ticketId,
                    content: statusChangeMessage,
                    senderType: SenderType.SYSTEM,
                    adminId, // Log which admin made the change
                }
            });

            return updatedTicket;
        } catch (error) {
            logger.error(`Error updating ticket status: ${error}`);
            throw new AppError(`Error updating ticket status: ${error}`, 500);
        }
    },

    async updateTicketPriority(ticketId: string, priority: TicketPriority, adminId: string) {
        try {
            // Check if ticket exists
            const ticket = await prisma.supportTicket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                throw new AppError("Support ticket not found", 404);
            }

            // Update ticket priority
            const updatedTicket = await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { 
                    priority,
                    adminId // Assign the admin who is updating the priority
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    },
                    admin: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        }
                    }
                }
            });

            // Add a system message about the priority change
            await prisma.ticketMessage.create({
                data: {
                    ticketId,
                    content: `Ticket priority has been updated to ${priority.toLowerCase()}`,
                    senderType: SenderType.SYSTEM,
                    adminId, // Log which admin made the change
                }
            });

            return updatedTicket;
        } catch (error) {
            logger.error(`Error updating ticket priority: ${error}`);
            throw new AppError(`Error updating ticket priority: ${error}`, 500);
        }
    },

    async getTicketStats() {
        try {
            const totalTickets = await prisma.supportTicket.count();
            const openTickets = await prisma.supportTicket.count({
                where: { status: TicketStatus.OPEN }
            });
            const pendingTickets = await prisma.supportTicket.count({
                where: { status: TicketStatus.PENDING }
            });
            const resolvedTickets = await prisma.supportTicket.count({
                where: { status: TicketStatus.RESOLVED }
            });
            
            const highPriorityTickets = await prisma.supportTicket.count({
                where: { 
                    priority: TicketPriority.HIGH,
                    status: { not: TicketStatus.RESOLVED }
                }
            });

            // Average resolution time (for resolved tickets)
            const resolvedTicketsData = await prisma.supportTicket.findMany({
                where: { 
                    status: TicketStatus.RESOLVED,
                    resolvedAt: { not: null }
                },
                select: {
                    createdAt: true,
                    resolvedAt: true,
                }
            });

            let totalResolutionTime = 0;
            resolvedTicketsData.forEach(ticket => {
                if (ticket.resolvedAt) {
                    const resolutionTimeMs = ticket.resolvedAt.getTime() - ticket.createdAt.getTime();
                    totalResolutionTime += resolutionTimeMs;
                }
            });

            const avgResolutionTimeHours = resolvedTicketsData.length > 0
                ? totalResolutionTime / resolvedTicketsData.length / (1000 * 60 * 60) // Convert ms to hours
                : 0;

            return {
                totalTickets,
                openTickets,
                pendingTickets,
                resolvedTickets,
                highPriorityTickets,
                avgResolutionTimeHours: Math.round(avgResolutionTimeHours * 10) / 10, // Round to 1 decimal place
            };
        } catch (error) {
            logger.error(`Error fetching ticket stats: ${error}`);
            throw new AppError(`Error fetching ticket stats: ${error}`, 500);
        }
    }
};