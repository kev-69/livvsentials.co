import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";
// upload image
import { uploadImage } from '../../../configs/cloudinary.config';

export const productService = {
    async addProduct(productData: {
        name: string;
        description: string;
        price: number;
        salePrice: number;
        stockQuantity: number;
        categoryId: string;
        productImages: string[];
        files: Express.Multer.File[];
    }) {
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

    async getProducts () {
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

    async updateProduct(productId: string, productData: {
        name?: string;
        description?: string;
        price?: number;
        salePrice?: number;
        inStock?: boolean;
        stockQuantity?: number;
        categoryId?: string;
        productImages?: string[];
        files?: Express.Multer.File[];
        existingImages?: string | string[];
    }) {
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

            // Properly parse existingImages if it's a JSON string
            let existingImages: string[] = [];
            if (productData.existingImages) {
                try {
                    if (typeof productData.existingImages === 'string') {
                        // Try to parse the JSON string
                        const parsed = JSON.parse(productData.existingImages);
                        
                        // Check if it's an array
                        if (Array.isArray(parsed)) {
                            // Make sure each item is a clean string without brackets or quotes
                            existingImages = parsed.map(url => 
                                typeof url === 'string' ? url.replace(/[\[\]"']/g, '') : url
                            );
                        } else {
                            logger.warn(`existingImages parsed but not an array: ${productData.existingImages}`);
                            existingImages = [];
                        }
                    } else if (Array.isArray(productData.existingImages)) {
                        // It's already an array
                        existingImages = productData.existingImages.map(url => 
                            typeof url === 'string' ? url.replace(/[\[\]"']/g, '') : url
                        );
                    }
                } catch (e) {
                    logger.error(`Error parsing existingImages: ${e}`);
                    // If parsing fails, use the original product images
                    existingImages = existingProduct.productImages;
                }
            } else {
                // No existingImages provided, so keep the current ones
                existingImages = existingProduct.productImages;
            }
            
            // Combine existing and new images
            const finalImages = [...existingImages, ...imageUrls];
            
            // Log the images for debugging
            logger.info(`Updating product ${productId} with images: ${JSON.stringify(finalImages)}`);

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

    async deleteProduct (productId: string) {
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

    async getTopSellingProduct() {
        try {
            // Get the product with the most order items
            const product = await prisma.product.findFirst({
                orderBy: {
                    orderItems: {
                        _count: 'desc'
                    },
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    orderItems: {
                        select: {
                            quantity: true,
                        },
                    },
                },
            });

            // If no product is found, return null
            if (!product) {
                return null;
            }

            // Calculate total units sold
            const totalSold = product.orderItems.reduce(
                (sum, item) => sum + item.quantity, 
                0
            );

            // Transform product data to match the interface expected by the frontend
            const transformedProduct = {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                productImages: product.productImages.map(url => 
                    typeof url === 'string' ? url.replace(/[\[\]"']/g, '') : url
                ),
                totalSold: totalSold,
                category: product.category.name
            };

            return transformedProduct;
        } catch (error) {
            logger.error(`Error fetching top selling product: ${error}`);
            throw new Error(`Error fetching top selling product: ${error}`);
        }
    },

    async getTopSellingProducts (limit: number = 10) {
        try {
            const products = await prisma.product.findMany({
                take: limit,
                orderBy: {
                    orderItems: {
                        _count: 'desc'
                    },
                },
                include: {
                    category: {
                        select: {
                            name: true,
                        },
                    },
                    orderItems: {
                        select: {
                            quantity: true,
                            price: true,
                        },
                    },
                },
        });

        // Transform the data to match the frontend requirements
        const transformedProducts = products.map(product => {
            // Calculate total units sold
            const unitSold = product.orderItems.reduce((total, item) => total + item.quantity, 0);
            
            // Calculate total sales amount
            const sales = product.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            return {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                unitSold: unitSold,
                sales: sales
            };
        });

        return transformedProducts;
        } catch (error) {
            logger.error(`Error fetching top selling products: ${error}`);
            throw new Error(`Error fetching top selling products: ${error}`);
        }
    }
}