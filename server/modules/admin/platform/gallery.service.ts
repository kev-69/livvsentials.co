import { prisma } from "../../../shared/prisma";
import { AppError } from "../../../utils/errors";
import logger from "../../../utils/logger";
import { settingsServices, SettingKey, GallerySettings, GalleryImage } from "./platform.service";

export const galleryService = {
    // Get gallery settings
    async getGallerySettings() {
        try {
            return await settingsServices.getSetting(SettingKey.GALLERY) as GallerySettings;
        } catch (error) {
            logger.error(`Error getting gallery settings: ${error}`);
            throw new AppError(`Error getting gallery settings: ${error}`, 500);
        }
    },

    // ===== Tag Management =====
    // Get all tags
    async getAllTags() {
        try {
            const gallerySettings = await this.getGallerySettings();
            return gallerySettings.tags || [];
        } catch (error) {
            logger.error(`Error getting gallery tags: ${error}`);
            throw new AppError(`Error getting gallery tags: ${error}`, 500);
        }
    },
    
    // Add a new tag
    async addTag(tag: string) {
        try {
            // Validate tag
            if (!tag || typeof tag !== 'string') {
                throw new AppError('Invalid tag format', 400);
            }
            
            // Format tag (lowercase, trim)
            const formattedTag = tag.toLowerCase().trim();
            
            // Get current settings
            const gallerySettings = await this.getGallerySettings();
            
            // Check if tag already exists
            if (gallerySettings.tags.includes(formattedTag)) {
                throw new AppError(`Tag "${formattedTag}" already exists`, 400);
            }
            
            // Add new tag
            gallerySettings.tags.push(formattedTag);
            
            // Save changes
            await settingsServices.updateSetting(SettingKey.GALLERY, {
                ...gallerySettings,
                tags: gallerySettings.tags
            });
            
            return formattedTag;
        } catch (error) {
            logger.error(`Error adding gallery tag: ${error}`);
            throw error instanceof AppError ? error : new AppError(`Error adding gallery tag: ${error}`, 500);
        }
    },
    
    // Update a tag
    async updateTag(oldTag: string, newTag: string) {
        try {
            // Validate tags
            if (!oldTag || !newTag || typeof oldTag !== 'string' || typeof newTag !== 'string') {
                throw new AppError('Invalid tag format', 400);
            }
            
            // Format tags
            const formattedOldTag = oldTag.toLowerCase().trim();
            const formattedNewTag = newTag.toLowerCase().trim();
            
            // Get current settings
            const gallerySettings = await this.getGallerySettings();
            
            // Check if old tag exists
            if (!gallerySettings.tags.includes(formattedOldTag)) {
                throw new AppError(`Tag "${formattedOldTag}" does not exist`, 404);
            }
            
            // Check if new tag already exists (and is not the same as old tag)
            if (formattedOldTag !== formattedNewTag && gallerySettings.tags.includes(formattedNewTag)) {
                throw new AppError(`Tag "${formattedNewTag}" already exists`, 400);
            }
            
            // Update tag in tags list
            gallerySettings.tags = gallerySettings.tags.map(tag => 
                tag === formattedOldTag ? formattedNewTag : tag
            );
            
            // Update tag in all images
            gallerySettings.images = gallerySettings.images.map(image => ({
                ...image,
                tags: image.tags.map(tag => tag === formattedOldTag ? formattedNewTag : tag)
            }));
            
            // Save changes
            await settingsServices.updateSetting(SettingKey.GALLERY, gallerySettings);
            
            return formattedNewTag;
        } catch (error) {
            logger.error(`Error updating gallery tag: ${error}`);
            throw error instanceof AppError ? error : new AppError(`Error updating gallery tag: ${error}`, 500);
        }
    },
    
    // Delete a tag
    async deleteTag(tag: string) {
        try {
            // Validate tag
            if (!tag || typeof tag !== 'string') {
                throw new AppError('Invalid tag format', 400);
            }
            
            // Format tag
            const formattedTag = tag.toLowerCase().trim();
            
            // Get current settings
            const gallerySettings = await this.getGallerySettings();
            
            // Check if tag exists
            if (!gallerySettings.tags.includes(formattedTag)) {
                throw new AppError(`Tag "${formattedTag}" does not exist`, 404);
            }
            
            // Remove tag from tags list
            gallerySettings.tags = gallerySettings.tags.filter(t => t !== formattedTag);
            
            // Remove tag from all images
            gallerySettings.images = gallerySettings.images.map(image => ({
                ...image,
                tags: image.tags.filter(t => t !== formattedTag)
            }));
            
            // Save changes
            await settingsServices.updateSetting(SettingKey.GALLERY, gallerySettings);
            
            return { success: true, message: `Tag "${formattedTag}" deleted successfully` };
        } catch (error) {
            logger.error(`Error deleting gallery tag: ${error}`);
            throw error instanceof AppError ? error : new AppError(`Error deleting gallery tag: ${error}`, 500);
        }
    },
    
    // ===== Gallery Item Management =====
    
    // Get all gallery items
    async getAllGalleryItems() {
        try {
            const gallerySettings = await this.getGallerySettings();
            return gallerySettings.images || [];
        } catch (error) {
            logger.error(`Error getting gallery images: ${error}`);
            throw new AppError(`Error getting gallery images: ${error}`, 500);
        }
    },
    
    // Add a gallery item
    async addGalleryItem(itemData: { url: string, alt: string, tags: string[], height: 'tall' | 'medium' | 'short' }) {
        try {
            const { url, alt, tags, height } = itemData;
            
            // Validate data
            if (!url || typeof url !== 'string') {
                throw new AppError('Image URL is required', 400);
            }
            
            if (!alt || typeof alt !== 'string') {
                throw new AppError('Alt text is required', 400);
            }
            
            if (!Array.isArray(tags)) {
                throw new AppError('Tags must be an array', 400);
            }
            
            if (!['tall', 'medium', 'short'].includes(height)) {
                throw new AppError('Height must be "tall", "medium", or "short"', 400);
            }
            
            // Get current settings
            const gallerySettings = await this.getGallerySettings();
            
            // Validate tags exist
            for (const tag of tags) {
                if (!gallerySettings.tags.includes(tag)) {
                    throw new AppError(`Tag "${tag}" does not exist`, 404);
                }
            }
            
            // Create new gallery item
            const newItem: GalleryImage = {
                id: Date.now(),
                url,
                alt,
                tags,
                height
            };
            
            // Add item to gallery
            gallerySettings.images.push(newItem);
            
            // Save changes
            await settingsServices.updateSetting(SettingKey.GALLERY, gallerySettings);
            
            return newItem;
        } catch (error) {
            logger.error(`Error adding gallery item: ${error}`);
            throw error instanceof AppError ? error : new AppError(`Error adding gallery item: ${error}`, 500);
        }
    },
    
    // Update a gallery item
    async updateGalleryItem(id: number, itemData: { alt?: string, tags?: string[], height?: 'tall' | 'medium' | 'short' }) {
        try {
            const { alt, tags, height } = itemData;
            
            // Get current settings
            const gallerySettings = await this.getGallerySettings();
            
            // Find the item
            const itemIndex = gallerySettings.images.findIndex(item => item.id === id);
            if (itemIndex === -1) {
                throw new AppError(`Gallery item with ID ${id} not found`, 404);
            }
            
            // Validate data
            if (tags) {
                if (!Array.isArray(tags)) {
                    throw new AppError('Tags must be an array', 400);
                }
                
                // Validate tags exist
                for (const tag of tags) {
                    if (!gallerySettings.tags.includes(tag)) {
                        throw new AppError(`Tag "${tag}" does not exist`, 404);
                    }
                }
            }
            
            if (height && !['tall', 'medium', 'short'].includes(height)) {
                throw new AppError('Height must be "tall", "medium", or "short"', 400);
            }
            
            // Update item
            gallerySettings.images[itemIndex] = {
                ...gallerySettings.images[itemIndex],
                alt: alt !== undefined ? alt : gallerySettings.images[itemIndex].alt,
                tags: tags !== undefined ? tags : gallerySettings.images[itemIndex].tags,
                height: height !== undefined ? height : gallerySettings.images[itemIndex].height
            };
            
            // Save changes
            await settingsServices.updateSetting(SettingKey.GALLERY, gallerySettings);
            
            return gallerySettings.images[itemIndex];
        } catch (error) {
            logger.error(`Error updating gallery item: ${error}`);
            throw error instanceof AppError ? error : new AppError(`Error updating gallery item: ${error}`, 500);
        }
    },
    
    // Delete a gallery item
    async deleteGalleryItem(id: number) {
        try {
            // Get current settings
            const gallerySettings = await this.getGallerySettings();
            
            // Find the item
            const itemIndex = gallerySettings.images.findIndex(item => item.id === id);
            if (itemIndex === -1) {
                throw new AppError(`Gallery item with ID ${id} not found`, 404);
            }
            
            // Remove item from gallery
            gallerySettings.images.splice(itemIndex, 1);
            
            // Save changes
            await settingsServices.updateSetting(SettingKey.GALLERY, gallerySettings);
            
            return { success: true, message: `Gallery item with ID ${id} deleted successfully` };
        } catch (error) {
            logger.error(`Error deleting gallery item: ${error}`);
            throw error instanceof AppError ? error : new AppError(`Error deleting gallery item: ${error}`, 500);
        }
    }
};