import { Request, Response } from "express";
import { galleryService } from "./gallery.service";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from '../../../utils/response';
import { uploadImage, deleteImage } from "../../../configs/cloudinary.config";
import fs from 'fs';

export const galleryController = {
    // ===== Tag Management ===== 
    // Get all tags
    getAllTags: async (req: Request, res: Response) => {
        try {
            const tags = await galleryService.getAllTags();
            res.status(200).json(successResponse('Tags fetched successfully', tags));
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
    
    // Add a new tag
    addTag: async (req: Request, res: Response) => {
        try {
            const { tag } = req.body;
            
            if (!tag) {
                throw new AppError('Tag is required', 400);
            }
            
            const newTag = await galleryService.addTag(tag);
            res.status(201).json(successResponse('Tag added successfully', { tag: newTag }));
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
    
    // Update a tag
    updateTag: async (req: Request, res: Response) => {
        try {
            const { oldTag, newTag } = req.body;
            
            if (!oldTag || !newTag) {
                throw new AppError('Old tag and new tag are required', 400);
            }
            
            const updatedTag = await galleryService.updateTag(oldTag, newTag);
            res.status(200).json(successResponse('Tag updated successfully', { tag: updatedTag }));
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
    
    // Delete a tag
    deleteTag: async (req: Request, res: Response) => {
        try {
            const { tag } = req.params;
            
            if (!tag) {
                throw new AppError('Tag is required', 400);
            }
            
            const result = await galleryService.deleteTag(tag);
            res.status(200).json(successResponse('Tag deleted successfully', result));
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
    
    // ===== Gallery Item Management =====
    
    // Get all gallery items
    getAllGalleryItems: async (req: Request, res: Response) => {
        try {
            const items = await galleryService.getAllGalleryItems();
            res.status(200).json(successResponse('Gallery items fetched successfully', items));
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
    
    // Add a gallery item
    addGalleryItem: async (req: Request, res: Response) => {
        try {
            const { alt, tags, height } = req.body;
            
            // Validate required fields
            if (!alt) {
                throw new AppError('Alt text is required', 400);
            }
            
            if (!tags) {
                throw new AppError('Tags are required', 400);
            }
            
            // Handle both single tag and multiple tags
            let parsedTags;
            try {
                // If tags is a JSON string, parse it
                if (typeof tags === 'string' && (tags.startsWith('[') || tags.startsWith('"'))) {
                    parsedTags = JSON.parse(tags);
                    
                    // If it's a single string (not in array format), convert to array
                    if (typeof parsedTags === 'string') {
                        parsedTags = [parsedTags];
                    }
                } else {
                    // If it's not JSON, treat as a single tag
                    parsedTags = [tags];
                }
                
                // Ensure parsedTags is always an array
                if (!Array.isArray(parsedTags)) {
                    parsedTags = [parsedTags];
                }
            } catch (err) {
                // If JSON parsing fails, treat as a single tag
                parsedTags = [tags];
            }
            
            // Normalize height value and check
            const normalizedHeight = height && typeof height === 'string' ? height.trim().toLowerCase() : height;
            
            if (!normalizedHeight || !['tall', 'medium', 'short'].includes(normalizedHeight)) {
                throw new AppError(`Height must be "tall", "medium", or "short", received: "${height}"`, 400);
            }
            
            // Check if file exists
            if (!req.file) {
                throw new AppError('Image file is required', 400);
            }
            
            // Upload image to Cloudinary
            const imageUrl = await uploadImage(req.file.path, 'livssentials-gallery');
            
            // Add gallery item
            const newItem = await galleryService.addGalleryItem({
                url: imageUrl,
                alt,
                tags: parsedTags,
                height: normalizedHeight as 'tall' | 'medium' | 'short'
            });
            
            res.status(201).json(successResponse('Gallery item added successfully', newItem));
        } catch (error) {
            // If file was uploaded but there was an error, try to clean up
            if (req.file && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (err) {
                    console.error('Error deleting temporary file:', err);
                }
            }
            
            if (error instanceof AppError) {
                res.status(error.statusCode).json(errorResponse(error.message));
            } else if (error instanceof Error) {
                res.status(500).json(errorResponse(error.message));
            } else {
                res.status(500).json(errorResponse('Internal server error'));
            }
        }
    },
    
    // Update a gallery item
    updateGalleryItem: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { alt, tags, height } = req.body;
            
            // Validate ID
            const itemId = parseInt(id);
            if (isNaN(itemId)) {
                throw new AppError('Invalid gallery item ID', 400);
            }
            
            // Parse tags if provided (handle single tag too)
            let parsedTags;
            if (tags) {
                try {
                    // If tags is a JSON string, parse it
                    if (typeof tags === 'string' && (tags.startsWith('[') || tags.startsWith('"'))) {
                        parsedTags = JSON.parse(tags);
                        
                        // If it's a single string (not in array format), convert to array
                        if (typeof parsedTags === 'string') {
                            parsedTags = [parsedTags];
                        }
                    } else {
                        // If it's not JSON, treat as a single tag
                        parsedTags = [tags];
                    }
                    
                    // Ensure parsedTags is always an array
                    if (!Array.isArray(parsedTags)) {
                        parsedTags = [parsedTags];
                    }
                } catch (err) {
                    // If JSON parsing fails, treat as a single tag
                    parsedTags = [tags];
                }
            }
            
            // Normalize height if provided
            let normalizedHeight = undefined;
            if (height) {
                normalizedHeight = typeof height === 'string' ? height.trim().toLowerCase() : height;
                if (!['tall', 'medium', 'short'].includes(normalizedHeight)) {
                    throw new AppError(`Height must be "tall", "medium", or "short", received: "${height}"`, 400);
                }
            }
            
            // Update gallery item
            const updatedItem = await galleryService.updateGalleryItem(itemId, {
                alt,
                tags: parsedTags,
                height: normalizedHeight as 'tall' | 'medium' | 'short' | undefined
            });
            
            res.status(200).json(successResponse('Gallery item updated successfully', updatedItem));
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
    
    // Delete a gallery item
    deleteGalleryItem: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            // Validate ID
            const itemId = parseInt(id);
            if (isNaN(itemId)) {
                throw new AppError('Invalid gallery item ID', 400);
            }
            
            // Get item before deleting to get the image URL
            const allItems = await galleryService.getAllGalleryItems();
            const itemToDelete = allItems.find(item => item.id === itemId);
            
            if (!itemToDelete) {
                throw new AppError(`Gallery item with ID ${itemId} not found`, 404);
            }
            
            // Delete from Cloudinary if possible
            try {
                // Extract public ID from URL
                const urlParts = itemToDelete.url.split('/');
                const filenameWithExtension = urlParts[urlParts.length - 1];
                const folderName = urlParts[urlParts.length - 2];
                const publicId = `${folderName}/${filenameWithExtension.split('.')[0]}`;
                
                await deleteImage(publicId);
            } catch (cloudinaryError) {
                console.error('Error deleting from Cloudinary:', cloudinaryError);
                // Continue with database deletion even if Cloudinary delete fails
            }
            
            // Delete gallery item
            const result = await galleryService.deleteGalleryItem(itemId);
            
            res.status(200).json(successResponse('Gallery item deleted successfully', result));
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
};