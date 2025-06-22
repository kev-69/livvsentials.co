import { Router } from "express";
import { z } from 'zod'

import { categoryController } from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

import { validateRequest } from "../../../middlewares/admin.middleware";


const router = Router();

// ======== CATEGORY-RELATED ROUTES ========
/**
 * @route GET /api/admin/categories/
 * @desc Get all categories
 * @access Admin only
*/
router.get('/categories', 
    categoryController.getCategories
);

/**
 * @route POST /api/admin/categories/
 * @desc Create a new categories
 * @access Admin only
*/
router.post('/categories', 
    validateRequest({
        body: createCategorySchema,
    }),
    categoryController.createCategory
);

/**
 * @route PATCH /api/admin/categories/:categoryId
 * @desc Update a categories
 * @access Admin only
*/
router.patch('/category/:categoryId', 
    validateRequest({
        params: z.object({ categoryId: z.string().uuid() }),
        body: updateCategorySchema.omit({ categoryId: true }),
    }),
    categoryController.updateCategory
);

/**
 * @route DELETE /api/admin/categories/:categoryId
 * @desc Delete a category
 * @access Admin only
*/
router.delete('/category/:categoryId', 
    validateRequest({
        params: z.object({ categoryId: z.string().uuid() }),
    }),
    categoryController.deleteCategory
);


export { router as categoryRoutes };

// Get order stats (total, weekly, etc.)
// Get order chart data (date, count)
// Get customer stats (total, guest, growth)
// Get customer growth data (for chart)
// Get payment stats (total, pending, refund)
// Get recent activity feed