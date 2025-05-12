import jwt from 'jsonwebtoken';
import bcrytp from 'bcrypt';
import { prisma } from '../../shared/prisma';
// import email services here

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

        // send welcome email

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
            id: user.id,
            // role: user.role,
            // isVerified: user.isVerified,
        };

        // generate token
        const token = jwt.sign( 
            payload,
            process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });

        return { token, user };
    },

    // reset password

    // verify code for reset password

    // set new password
    setNewPassword: async (userId: string, password: string) => {
        // hash password
        const hashedPassword = await bcrytp.hash(password, 10);

        // update user password
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        return user;
    },

    // resent reset password code
}