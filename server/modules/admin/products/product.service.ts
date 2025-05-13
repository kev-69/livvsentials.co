import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";
// upload image
import { uploadImage } from '../../../configs/cloudinary.config';

export const productService = {
    addProduct: async (productData: {
        name: string;
        description: string;
        price: number;
        salePrice: number;
        stockQuantity: number;
        categoryId: string;
        productImages: string[];
        files: Express.Multer.File[];
    }) => {
        try{
            // check if category exists
            const category = await prisma.category.findUnique({
                where: { id: productData.categoryId },
            });
            if (!category) {
                throw new Error(`Category with ID ${productData.categoryId} does not exist`);
            }

            // upload images to cloudinary
            const imageUrls = await Promise.all(
                productData.files.map(async (file) => uploadImage(file.path))
            );

            // check if product already exists
            const existingProduct = await prisma.product.findFirst({
                where: { name: productData.name },
            });
            if (existingProduct) {
                throw new Error(`Product with name ${productData.name} already exists`);
            }

            // Generate slug from name (lowercase, replace spaces with hyphens)
            const slug = productData.name.toLowerCase().replace(/\s+/g, '-');

            // create new product
            const product = await prisma.product.create({
                data: {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    salePrice: productData.salePrice,
                    stockQuantity: productData.stockQuantity,
                    categoryId: productData.categoryId,
                    slug,
                    productImages: imageUrls
                },
            });
            return product;
        }catch (error) {
            logger.error(`Error creating product: ${error}`);
            throw new Error(`Error creating product: ${error}`);
        }
    },

    getProducts: async () => {
        try {
            const products = await prisma.product.findMany({
                include: {
                    category: true,
                },
            });
            return products;
        } catch (error) {
            logger.error(`Error fetching products: ${error}`);
            throw new Error(`Error fetching products: ${error}`);
        }
    },

    updateProduct: async (productId: string, productData: {
        name?: string;
        description?: string;
        price?: number;
        salePrice?: number;
        inStock?: boolean;
        stockQuantity?: number;
        categoryId?: string;
        productImages?: string[];
        files?: Express.Multer.File[];
        existingImages?: string[];
    }) => {
        try {
            // check if product exists
            const existingProduct = await prisma.product.findUnique({
                where: { id: productId },
            });
            if (!existingProduct) {
                throw new Error(`Product with ID ${productId} does not exist`);
            }
            // check if category is being updated
            if (productData.categoryId) {
                const categoryExists = await prisma.category.findUnique({
                    where: { id: productData.categoryId },
                });
                if (!categoryExists) {
                    throw new Error(`Category with ID ${productData.categoryId} does not exist`);
                }
            }
            // handle slug update
            let updatedSlug;
            if (productData.name) {
                updatedSlug = productData.name.toLowerCase().replace(/\s+/g, '-');
            } else {
                updatedSlug = existingProduct.slug;
            }
            // handle image upload
            let imageUrls: string[] = [];
            if (productData.files && productData.files.length > 0) {
                imageUrls = await Promise.all(
                    productData.files.map(async (file) => uploadImage(file.path))
                );
            }

            // Combine existing and new images if both are provided
            let finalImages = existingProduct.productImages;
            if (productData.existingImages && productData.existingImages.length > 0) {
                // If we're explicitly passing existing images, use only those as the base
                finalImages = productData.existingImages;
            }
            
            if (imageUrls.length > 0) {
                // Add new images to the existing ones
                finalImages = [...finalImages, ...imageUrls];
            }

            const product = await prisma.product.update({
                where: { id: productId },
                data: {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    salePrice: productData.salePrice,
                    inStock: productData.inStock,
                    stockQuantity: productData.stockQuantity,
                    categoryId: productData.categoryId,
                    productImages: finalImages,
                    slug: updatedSlug,
                },
            });
            return product;
        } catch (error) {
            logger.error(`Error updating product: ${error}`);
            throw new Error(`Error updating product: ${error}`);
        }
    },

    deleteProduct: async (productId: string) => {
        try {
            const product = await prisma.product.delete({
                where: { id: productId },
            });
            return product;
        } catch (error) {
            logger.error(`Error deleting product: ${error}`);
            throw new Error(`Error deleting product: ${error}`);
        }
    },
}