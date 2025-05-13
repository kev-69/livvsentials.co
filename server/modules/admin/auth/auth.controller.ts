import { Response, Request } from "express";
import { login } from "./auth.service";
import { z } from "zod";
import { AppError } from "../../../utils/errors";
import { successResponse, errorResponse } from "../../../utils/response";

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const loginSchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        loginSchema.parse({ email, password });

        // Call the login service
        const result = await login(email, password);

        // Send success response
        res.status(200).json(
            successResponse('Admin login successful', result),
        );
    } catch (error) {
        if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(400).json(errorResponse(error.message));
            } else {
                res.status(400).json({ message: 'An unknown error occurred' });
            }
    }
}