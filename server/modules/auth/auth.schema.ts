import { z } from 'zod';

export const registerSchema = z.object({
    firstName: z.string().min(3, { message: 'First name must be at least 3 characters long' }),
    lastName: z.string().min(3, { message: 'Last name must be at least 3 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    phone: z.string().min(10).max(15),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

// set new password schema
export const setNewPasswordSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    confirmPassword: z.string().min(8, { message: 'Confirm password must be at least 8 characters long' }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match' },
)