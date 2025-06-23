import { prisma } from "../../../shared/prisma";

export const categoryService = {
    async createCategory (name: string, description: string) {
        // check if category already exists
        const existingCategory = await prisma.category.findUnique({
            where: { name },
        });
        if (existingCategory) {
            throw new Error(`Category with name ${name} already exists`);
        }

        // Generate slug from name (lowercase, replace spaces with hyphens)
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        // create new category
        const category = await prisma.category.create({
            data: {
                name,
                description,
                slug,
            },
        });
        
        return category;
    },

    async getCategories () {
        const categories = await prisma.category.findMany();
        return categories;
    },

    async updateCategory(categoryId: string, categoryData: { name?: string; description?: string}) {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: categoryData.name,
                description: categoryData.description,
            },
        });
        return category;
    },

    async deleteCategory(categoryId: string) {
        const category = await prisma.category.delete({
            where: { id: categoryId },
        });
        return category;
    }
}