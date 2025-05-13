import { z } from 'zod';

export const addProductSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Product description is required'),
    price: z.number().min(0, 'Product price is required'),
    salePrice: z.number().min(0, 'Product sale price is required'),
    stockQuantity: z.number().min(0, 'Product stock quantity is required'),
    categoryId: z.string().min(1, 'Product category is required'),
    productImages: z.array(z.string()).min(1, 'At least one product image is required'),
    inStock: z.boolean().optional(),
    slug: z.string().optional(),
})

export const updateProductSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    salePrice: z.number().optional(),
    stockQuantity: z.number().optional(),
    categoryId: z.string().optional(),
    productImages: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
}).partial()