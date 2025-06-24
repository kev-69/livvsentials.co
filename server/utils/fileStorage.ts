import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const saveProfilePhoto = async (file: Express.Multer.File): Promise<string> => {
  try {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Create a readable stream from the temporary file
    const readStream = fs.createReadStream(file.path);
    
    // Create a writable stream to the destination
    const writeStream = fs.createWriteStream(filePath);
    
    // Pipe the read stream to the write stream
    readStream.pipe(writeStream);
    
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        // Remove the temporary file
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error removing temp file:', err);
        });
        
        // Return the relative path to store in the database
        const dbPath = `/uploads/profiles/${fileName}`;
        resolve(dbPath);
      });
      
      writeStream.on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    throw error;
  }
};