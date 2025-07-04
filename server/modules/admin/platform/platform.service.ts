import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";
import { uploadGalleryImage, deleteImage, getPublicIdFromUrl } from "../../../configs/cloudinary.config";
import fs from 'fs';

// Define setting keys and their structure for type safety
export enum SettingKey {
    APPEARANCE = "appearance",
    SEO = "seo",
    CONTACT_INFO = "contact_info",
    EMAILS = "emails",
    NOTIFICATIONS = "notifications",
    GALLERY = "gallery"
}

// Define interfaces for each setting type
interface AppearanceSettings {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    headingsFont: string;
    styledHeader: string;
    bodyFont: string;
    siteBanner: string;
}

interface SEOSettings {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
}

interface ContactInfoSettings {
    email: string;
    phone: string;
    address: string;
    googleMapsLink: string;
    socialMedia: {
        facebook: string;
        instagram: string;
        snapchat: string;
        tiktok: string;
    }
}

interface MessageSettings {
    senderName: string;
    templates: {
        restock: {
            subject: string;
            body: string;
        }
        orderConfirmation: {
            subject: string;
            body: string;
        };
        shipping: {
            subject: string;
            body: string;
        };
        delivery: {
            subject: string;
            body: string;
        };
    }
}

interface NotificationSettings {
    enableOrderNotifications: boolean;
    enableStockAlerts: boolean;
    stockThreshold: number;
}

export interface GalleryImage {
    id: number;
    url: string;
    alt: string;
    tags: string[];
    height: 'tall' | 'medium' | 'short';
}

export interface GallerySettings {
    images: GalleryImage[];
    tags: string[]; // List of all available tags for filtering
}

export const settingsServices = {
    async getSetting(key: SettingKey) {
        try {
            const setting = await prisma.platformSettings.findUnique({
                where: { settingKey: key }
            });

            if (!setting) {
                // Return default settings if not found
                return this.getDefaultSettings(key);
            }

            return setting.settingValue;
        } catch (error) {
            logger.error(`Error fetching setting ${key}: ${error}`);
            throw new AppError(`Error fetching setting: ${error}`, 500);
        }
    },

    async updateSetting(key: SettingKey, value: any) {
        try {
            // Get the current setting or default if it doesn't exist
            const currentSetting = await this.getSetting(key);
            
            // Merge the new values with existing ones
            const updatedValue = { ...currentSetting, ...value };
            
            // Validate the setting structure
            this.validateSetting(key, updatedValue);

            // Upsert the setting (update if exists, create if not)
            const setting = await prisma.platformSettings.upsert({
                where: { settingKey: key },
                update: { settingValue: updatedValue },
                create: { settingKey: key, settingValue: updatedValue }
            });

            return setting.settingValue;
        } catch (error) {
            logger.error(`Error updating setting ${key}: ${error}`);
            throw new AppError(`Error updating setting: ${error}`, 500);
        }
    },

    async getAllSettings() {
        try {
            const settingKeys = Object.values(SettingKey);
            const settings: Record<string, any> = {};

            // Fetch all settings from database
            const dbSettings = await prisma.platformSettings.findMany();

            // Create a map for easier lookup
            const settingsMap = new Map(
                dbSettings.map(setting => [setting.settingKey, setting.settingValue])
            );

            // Build the complete settings object with defaults for missing values
            for (const key of settingKeys) {
                if (settingsMap.has(key)) {
                    settings[key] = settingsMap.get(key);
                } else {
                    settings[key] = this.getDefaultSettings(key as SettingKey);
                }
            }

            return settings;
        } catch (error) {
            logger.error(`Error fetching all settings: ${error}`);
            throw new AppError(`Error fetching all settings: ${error}`, 500);
        }
    },

    validateSetting(key: SettingKey, value: any) {
        switch (key) {
            case SettingKey.APPEARANCE:
                // Validate only provided fields instead of requiring all
                if (value.primaryColor && typeof value.primaryColor !== 'string') {
                    throw new AppError("primaryColor must be a string", 400);
                }
                if (value.secondaryColor && typeof value.secondaryColor !== 'string') {
                    throw new AppError("secondaryColor must be a string", 400);
                }
                if (value.accentColor && typeof value.accentColor !== 'string') {
                    throw new AppError("accentColor must be a string", 400);
                }
                if (value.textColor && typeof value.textColor !== 'string') {
                    throw new AppError("textColor must be a string", 400);
                }
                if (value.headingsFont && typeof value.headingsFont !== 'string') {
                    throw new AppError("headingsFont must be a string", 400);
                }
                if (value.bodyFont && typeof value.bodyFont !== 'string') {
                    throw new AppError("bodyFont must be a string", 400);
                }
                if (value.styledHeader && typeof value.styledHeader !== 'string') {
                    throw new AppError("styledHeader must be a string", 400);
                }
                if (value.siteBanner && typeof value.siteBanner !== 'string') {
                    throw new AppError("siteBanner must be a string", 400);
                }
                break;
            case SettingKey.SEO:
                if (value.metaTitle && typeof value.metaTitle !== 'string') {
                    throw new AppError("metaTitle must be a string", 400);
                }
                if (value.metaDescription && typeof value.metaDescription !== 'string') {
                    throw new AppError("metaDescription must be a string", 400);
                }
                if (value.keywords && !Array.isArray(value.keywords)) {
                    throw new AppError("keywords must be an array", 400);
                }
                break;
            case SettingKey.CONTACT_INFO:
                if (value.email && typeof value.email !== 'string') {
                    throw new AppError("email must be a string", 400);
                }
                if (value.phone && typeof value.phone !== 'string') {
                    throw new AppError("phone must be a string", 400);
                }
                if (value.address && typeof value.address !== 'string') {
                    throw new AppError("address must be a string", 400);
                }
                if (value.googleMapsLink && typeof value.googleMapsLink !== 'string') {
                    throw new AppError("googleMapsLink must be a string", 400);
                }
                if (value.socialMedia) {
                    if (typeof value.socialMedia !== 'object') {
                        throw new AppError("socialMedia must be an object", 400);
                    }
                    const { facebook, instagram, snapchat, tiktok } = value.socialMedia;
                    if (facebook && typeof facebook !== 'string') {
                        throw new AppError("facebook must be a string", 400);
                    }
                    if (instagram && typeof instagram !== 'string') {
                        throw new AppError("instagram must be a string", 400);
                    }
                    if (snapchat && typeof snapchat !== 'string') {
                        throw new AppError("snapchat must be a string", 400);
                    }
                    if (tiktok && typeof tiktok !== 'string') {
                        throw new AppError("tiktok must be a string", 400);
                    }
                }
                break;
            case SettingKey.EMAILS:
                if (value.senderName && typeof value.senderName !== 'string') {
                    throw new AppError("senderName must be a string", 400);
                }
                if (value.templates) {
                    if (typeof value.templates !== 'object') {
                        throw new AppError("templates must be an object", 400);
                    }
                    // Validate template structure if provided
                    const validateTemplate = (template: any, name: string) => {
                        if (!template) return;
                        if (typeof template !== 'object') {
                            throw new AppError(`${name} template must be an object`, 400);
                        }
                        if (template.subject && typeof template.subject !== 'string') {
                            throw new AppError(`${name} subject must be a string`, 400);
                        }
                        if (template.body && typeof template.body !== 'string') {
                            throw new AppError(`${name} body must be a string`, 400);
                        }
                    };
                    
                    if (value.templates.restock) {
                        validateTemplate(value.templates.restock, 'restock');
                    }
                    if (value.templates.orderConfirmation) {
                        validateTemplate(value.templates.orderConfirmation, 'orderConfirmation');
                    }
                    if (value.templates.shipping) {
                        validateTemplate(value.templates.shipping, 'shipping');
                    }
                    if (value.templates.delivery) {
                        validateTemplate(value.templates.delivery, 'delivery');
                    }
                }
                break;
            case SettingKey.NOTIFICATIONS:
                if (value.enableOrderNotifications !== undefined && 
                    typeof value.enableOrderNotifications !== 'boolean') {
                    throw new AppError("enableOrderNotifications must be a boolean", 400);
                }
                if (value.enableStockAlerts !== undefined && 
                    typeof value.enableStockAlerts !== 'boolean') {
                    throw new AppError("enableStockAlerts must be a boolean", 400);
                }
                if (value.stockThreshold !== undefined) {
                    if (typeof value.stockThreshold !== 'number') {
                        throw new AppError("stockThreshold must be a number", 400);
                    }
                    if (value.stockThreshold < 0) {
                        throw new AppError("stockThreshold must be a non-negative number", 400);
                    }
                }
                break;
            case SettingKey.GALLERY:
                // Basic validation for gallery settings
                if (value.images && !Array.isArray(value.images)) {
                    throw new AppError("images must be an array", 400);
                }
                if (value.tags && !Array.isArray(value.tags)) {
                    throw new AppError("tags must be an array", 400);
                }
                break;
            default:
                throw new AppError(`Unknown setting key: ${key}`, 400);
        }
    },

    getDefaultSettings(key: SettingKey) {
        switch (key) {
            case SettingKey.APPEARANCE:
                return {
                    primaryColor: "#4f46e5",
                    secondaryColor: "#1e293b",
                    accentColor: "#f59e0b",
                    textColor: "#1f2937",
                    headingsFont: "Montserrat, sans-serif",
                    bodyFont: "Inter, sans-serif",
                    styledHeader: 'Sacramento, sans-serif',
                    siteBanner: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
                } as AppearanceSettings;
            case SettingKey.SEO:
                return {
                    metaTitle: "Livssentials - Your Beauty Shop",
                    metaDescription: "Shop the latest beauty products and accessories.",
                    keywords: ["beauty", "skincare", "makeup", "accessories"],
                } as SEOSettings;
            case SettingKey.CONTACT_INFO:
                return {
                    email: "info@livssentials.com",
                    phone: "+233 20 1234567",
                    address: "123 Shop Street, Accra, Ghana",
                    googleMapsLink: "",
                    socialMedia: {
                        facebook: "",
                        instagram: "",
                        snapchat: "",
                        tiktok: ""
                    }
                } as ContactInfoSettings;
            case SettingKey.EMAILS:
                return {
                    senderName: "Livssentials.Co",
                    templates: {
                        restock: {
                            subject: "We have restocked!",
                            body: "We are pleased to inform you that we have restocked."
                        },
                        orderConfirmation: {
                            subject: "Your order has been confirmed",
                            body: "Thank you for your order. We will process it shortly."
                        },
                        shipping: {
                            subject: "Your order has been shipped",
                            body: "Your order is on its way to you."
                        },
                        delivery: {
                            subject: "Your order has been delivered",
                            body: "Your order has been delivered. We hope you enjoy your purchase."
                        }
                    }
                } as MessageSettings;
            case SettingKey.NOTIFICATIONS:
                return {
                    enableOrderNotifications: true,
                    enableStockAlerts: true,
                    stockThreshold: 5,
                } as NotificationSettings;
            case SettingKey.GALLERY:
                return {
                    images: [],
                    tags: []
                } as GallerySettings;
            default:
                return {};
        }
    }
};