import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../../shared/prisma';
import { saveProfilePhoto } from '../../../utils/fileStorage';

export const login = async (email: string, password: string) => {
    // Find admin by email
    const admin = await prisma.admin.findUnique({
        where: { email },
    });

    if (!admin) {
        throw new Error('Admin not found');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET as string, {
        expiresIn: '12h',
    });

    return { token, admin };
}

export const authService = {
    async fetchProfile (adminId: string) {
        // Fetch admin profile by ID
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePhoto: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!admin) {
            throw new Error('Admin not found');
        }

        return admin;
    },
    
    async changePassword(adminId: string, currentPassword: string, newPassword: string) {
        try {
            // Find admin by ID
            const admin = await prisma.admin.findUnique({
                where: { id: adminId },
            });

            if (!admin) {
                throw new Error('Admin not found');
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isPasswordValid) {
                throw new Error('Current password is incorrect');
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update admin's password
            const updatedAdmin = await prisma.admin.update({
                where: { id: adminId },
                data: { password: hashedPassword },
            });

            return updatedAdmin;
        } catch (error) {
            throw error;
        }
    },

    async updateProfile(adminId: string, profileData: { 
        firstName?: string, 
        lastName?: string, 
        email?: string,
        profilePhoto?: string;
        files?: Express.Multer.File[] 
    }) {
        try {
            // Find admin by ID
            const admin = await prisma.admin.findUnique({
                where: { id: adminId },
            });

            if (!admin) {
                throw new Error('Admin not found');
            }

            const dataToUpdate: any = { ...profileData };
            delete dataToUpdate.files; // Remove files from data to update

            // Handle profile photo upload if files are provided
            if (profileData.files && profileData.files.length > 0) {
                const file = profileData.files[0]; // Get first file
                // Use local storage instead of Cloudinary
                const filePath = await saveProfilePhoto(file);
                dataToUpdate.profilePhoto = filePath;
            }

            // Update admin's profile
            const updatedAdmin = await prisma.admin.update({
                where: { id: adminId },
                data: dataToUpdate,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePhoto: true,
                    email: true,
                    role: true,
                    createdAt: true,
                }
            });

            return updatedAdmin;
        } catch (error) {
            throw error;
        }
    },
}
