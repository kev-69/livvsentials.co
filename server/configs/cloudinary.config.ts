import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// configuring cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// function to upload image to cloudinary with folder specification
export const uploadImage = async (filePath: string, folder = 'livssentials-products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    // remove the file from local storage after uploading to cloudinary
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // remove the file if it exists
    }

    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};

// Specific function for gallery images
export const uploadGalleryImage = async (filePath: string) => {
  return uploadImage(filePath, 'livssentials-gallery');
};

// Function to delete an image from Cloudinary
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Error deleting image from Cloudinary');
  }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  // Example URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/filename.jpg
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename.split('.')[0]}`;
};