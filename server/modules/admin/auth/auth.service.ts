import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../../../shared/prisma';

export const login = async (email: string, password: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('User not found');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });

    return { token, user };
}