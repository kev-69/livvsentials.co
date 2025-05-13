import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
    description: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).optional(),
    description: z.string().optional(),
}).refine((data) => data.name || data.description, {
    message: 'At least one field (name or description) must be provided for update',
});