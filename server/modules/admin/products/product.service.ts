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
    }) => {
        try {
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
                    productImages: productData.productImages
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