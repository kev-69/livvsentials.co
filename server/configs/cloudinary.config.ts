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

// function to upload image to cloudinary
export const uploadImage = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'livvsentials-products',
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