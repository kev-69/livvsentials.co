import { prisma } from "../../../shared/prisma";

export const createCategory = async (name: string, description: string) => {
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
}

export const getCategories = async () => {
    try {
        const categories = await prisma.category.findMany();
        return categories;
    } catch (error) {
        throw new Error(`Error fetching categories: ${error}`);
    }
}

export const updateCategory = async (categoryId: string, categoryData: {
    name?: string;
    description?: string;
}) => {
    try {
        const category = await prisma.category.update({
            where: { id: categoryId },
            data: {
                name: categoryData.name,
                description: categoryData.description,
            },
        });
        return category;
    } catch (error) {
        throw new Error(`Error updating category: ${error}`);
    }
}

export const deleteCategory = async (categoryId: string) => {
    try {
        const category = await prisma.category.delete({
            where: { id: categoryId },
        });
        return category;
    } catch (error) {
        throw new Error(`Error deleting category: ${error}`);
    }
}