import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";

export const platformService = {
    async getSetting (key: string) {
        try {
            const setting = await prisma.platformSettings.findUnique({
                where: { settingKey: key }
            });

            return setting;
        } catch (error) {
            logger.error(`Error fetching setting ${key}: ${error}`);
            throw new AppError(`Error fetching setting: ${error}`, 500);
        }
    }
}