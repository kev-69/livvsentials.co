import { Request, Response } from "express";
import { settingsServices, SettingKey } from "./platform.service";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from '../../../utils/response';

export const settingsController = {
    getSetting: async (req: Request, res: Response) => {
        try {
            const { key } = req.params;
            
            // Validate key
            if (!Object.values(SettingKey).includes(key as SettingKey)) {
                throw new AppError(`Invalid setting key: ${key}`, 400);
            }
            
            const setting = await settingsServices.getSetting(key as SettingKey);
            
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
    },

    updateSetting: async (req: Request, res: Response) => {
        try {
            const { key } = req.params;
            const value = req.body;
            
            // Validate key
            if (!Object.values(SettingKey).includes(key as SettingKey)) {
                throw new AppError(`Invalid setting key: ${key}`, 400);
            }
            
            const setting = await settingsServices.updateSetting(key as SettingKey, value);
            
            res.status(200).json(successResponse('Platform settings updated successfully', setting));
        } catch (error) {
             if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },

    getAllSettings: async (req: Request, res: Response) => {
        try {
            const settings = await settingsServices.getAllSettings();
            
            res.status(200).json(successResponse('Successfully fetched all settings', settings));
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },
};