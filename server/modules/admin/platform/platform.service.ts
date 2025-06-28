import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";

// Define setting keys and their structure for type safety
export enum SettingKey {
    APPEARANCE = "appearance",
    SEO = "seo",
    CONTACT_INFO = "contact_info",
    SHIPPING = "shipping",
    PAYMENT = "payment",
    EMAILS = "emails",
    NOTIFICATIONS = "notifications"
}

// Define interfaces for each setting type
interface AppearanceSettings {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    headingsFont: string;
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

interface ShippingSettings {
    enableFreeShipping: boolean;
    freeShippingThreshold: number;
    defaultShippingFee: number;
    shippingRegions: {
        name: string;
        fee: number;
    }[];
}

interface PaymentSettings {
    enableMobileMoney: boolean;
    enableCreditCard: boolean;
    mobileMoneyProviders: string[];
    paymentInstructions: string;
}

interface EmailSettings {
    senderName: string;
    senderEmail: string;
    templates: {
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
            // Validate the setting structure
            this.validateSetting(key, value);

            // Upsert the setting (update if exists, create if not)
            const setting = await prisma.platformSettings.upsert({
                where: { settingKey: key },
                update: { settingValue: value },
                create: { settingKey: key, settingValue: value }
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
                }
            }

            return settings;
        } catch (error) {
            logger.error(`Error fetching all settings: ${error}`);
            throw new AppError(`Error fetching all settings: ${error}`, 500);
        }
    },

    validateSetting(key: SettingKey, value: any) {
        // Add validation logic for each setting type
        switch (key) {
            case SettingKey.APPEARANCE:
                if (!value.siteName) {
                    throw new AppError("Site name is required", 400);
                }
                break;
            case SettingKey.SEO:
                if (!value.metaTitle || !value.metaDescription) {
                    throw new AppError("Meta title and description are required", 400);
                }
                break;
            case SettingKey.CONTACT_INFO:
                if (!value.email || !value.phone) {
                    throw new AppError("Email and phone are required", 400);
                }
                break;
            case SettingKey.SHIPPING:
                if (value.enableFreeShipping === undefined || value.defaultShippingFee === undefined) {
                    throw new AppError("Shipping settings are incomplete", 400);
                }
                break;
            case SettingKey.PAYMENT:
                // Add payment validation
                break;
            case SettingKey.EMAILS:
                if (!value.senderEmail) {
                    throw new AppError("Sender email is required", 400);
                }
                break;
            case SettingKey.NOTIFICATIONS:
                // Add notification validation
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
            case SettingKey.SHIPPING:
                return {
                    enableFreeShipping: false,
                    freeShippingThreshold: 100,
                    defaultShippingFee: 10,
                    shippingRegions: []
                } as ShippingSettings;
            case SettingKey.PAYMENT:
                return {
                    enableMobileMoney: true,
                    enableCreditCard: false,
                    mobileMoneyProviders: ["MTN", "Vodafone"],
                    paymentInstructions: "Please complete your payment within 24 hours."
                } as PaymentSettings;
            case SettingKey.EMAILS:
                return {
                    senderName: "Livssentials",
                    senderEmail: "noreply@livssentials.com",
                    templates: {
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
                } as EmailSettings;
            case SettingKey.NOTIFICATIONS:
                return {
                    enableOrderNotifications: true,
                    enableStockAlerts: true,
                    stockThreshold: 5,
                    adminEmails: []
                } as NotificationSettings;
            default:
                return {};
        }
    }
};