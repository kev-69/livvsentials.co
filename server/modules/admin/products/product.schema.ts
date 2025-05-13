import { z } from 'zod';

// Schema for validating incoming form data (before Cloudinary processing)
export const addProductFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.string().transform((val) => parseFloat(val)), // Form data sends strings
  salePrice: z.string().transform((val) => parseFloat(val)), // Form data sends strings
  stockQuantity: z.string().transform((val) => parseInt(val, 10)), // Form data sends strings
  categoryId: z.string().min(1, 'Product category is required'),
  inStock: z.string().optional().transform((val) => val === 'true'), // Convert to boolean
  // Images are handled separately via files
});

// Schema for validating the complete product after image processing
export const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.number().min(0, 'Product price is required'),
  salePrice: z.number().min(0, 'Product sale price is required'),
  stockQuantity: z.number().min(0, 'Product stock quantity is required'),
  categoryId: z.string().min(1, 'Product category is required'),
  productImages: z.array(z.string()).min(1, 'At least one product image is required'),
  inStock: z.boolean().optional().default(true),
  slug: z.string().optional(),
});

// Update schemas follow the same pattern
export const updateProductFormSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  salePrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  stockQuantity: z.string().optional().transform((val) => val ? parseInt(val, 10) : undefined),
  categoryId: z.string().optional(),
  inStock: z.string().optional().transform((val) => val === 'true'),
  // Existing images can be passed as comma-separated string
  existingImages: z.string().optional().transform(val => val ? val.split(',') : []),
});

export const updateProductSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  stockQuantity: z.number().min(0).optional(),
  categoryId: z.string().optional(),
  productImages: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
});

// Use different names for the types to avoid conflicts
export type AddProductInput = z.infer<typeof addProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;