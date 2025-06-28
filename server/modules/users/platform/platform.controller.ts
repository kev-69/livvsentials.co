import { Request, Response } from "express";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from '../../../utils/response';
import { platformService } from "./platform.service";

export const platformController = {
    getSetting: async (req: Request, res: Response) => {
        try {
            const { key } = req.params;
            const setting = await platformService.getSetting(key);
            res.status(200).json(successResponse('Successfully fectched platform settings', setting));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    }
}
