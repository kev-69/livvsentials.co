import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";

export const productService = {
    async getProducts() {
        try {
            const products = await prisma.product.findMany({
                include: {
                    category: true,
                }
            })

            return products
        } catch (error) {
            logger.error(`Error fetching products: ${error}`)
            throw new Error('Failed to fetch products');
        }
    },

    async getProductBySlug (slug: string) {
        try {
            const product = await prisma.product.findUnique({
                where: { slug },
                include: {
                    category: true,
                    reviews: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                }
                            }
                        }
                    }
                }
            })

            if (!product) {
                throw new Error('Product not found')
            }

            return product
        } catch (error) {
            logger.error(`Error fetching product by slug: ${error}`)
            throw new Error('Failed to fetch product');   
        }
    }
}