import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  categoryId: z.string().uuid(), // Add this field for parameter validation
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }).optional(),
  description: z.string().optional(),
})

// Use different names for the types to avoid conflicts
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;