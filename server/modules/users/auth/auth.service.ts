import jwt from 'jsonwebtoken';
import bcrytp from 'bcrypt';
import { prisma } from '../../../shared/prisma';
// import message services here

export const authService = {
    register: async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
        // check if user already exists
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userExists) {
            throw new Error('User already exists');
        }

        // hash password
        const hashedPassword = await bcrytp.hash(password, 10);

        // create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                // role: 'USER',
                // isVerified: false,
            },
        });

        // send welcome message

        return user;
    },

    login: async (email: string, password: string) => {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // check if password is correct
        const isPasswordValid = await bcrytp.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const payload = {
            userId: user.id,
            role: user.role,
            // isVerified: user.isVerified,
        };

        // generate token
        const token = jwt.sign( 
            payload,
            process.env.JWT_SECRET as string, {
            expiresIn: '12h',
        });

        return { token, user };
    },

    getProfile: async (userId: string) => {
        // get user profile
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    },

    updateProfile: async (userId: string, data: Partial<{ firstName: string; lastName: string; phone: string }>) => {
        // update user profile
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data,
        });

        return user;
    },

    changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // check if current password is correct
        const isPasswordValid = await bcrytp.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // hash new password
        const hashedPassword = await bcrytp.hash(newPassword, 10);

        // update user password
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return updatedUser;
    },

    // request password reset

    // verify code for reset password

    // set new password
    // setNewPassword: async (userId: string, password: string) => {
    //     // hash password
    //     const hashedPassword = await bcrytp.hash(password, 10);

    //     // update user password
    //     const user = await prisma.user.update({
    //         where: {
    //             id: userId,
    //         },
    //         data: {
    //             password: hashedPassword,
    //         },
    //     });

    //     return user;
    // },

    // resend reset password code
}