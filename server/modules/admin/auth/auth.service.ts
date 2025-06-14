import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../../shared/prisma';

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
        expiresIn: '1h',
    });

    return { token, admin };
}

export const fetchProfile = async (adminId: string) => {
    // Fetch admin profile by ID
    const admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!admin) {
        throw new Error('Admin not found');
    }

    return admin;
}