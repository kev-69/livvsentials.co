import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";

export const categoryService = {
    async getCategories() {
        try {
            const categories = await prisma.category.findMany();
            return categories;
        } catch (error) {
            logger.error("Error getting categories:", error);
            throw new Error("Could not retrieve categories");
        }
    },

    async getCategoryById(id: string) {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
            });
            if (!category) {
                throw new Error("Category not found");
            }
            return category;
        } catch (error) {
            logger.error("Error getting category by ID:", error);
            throw new Error("Could not retrieve category");
        }
    }
};