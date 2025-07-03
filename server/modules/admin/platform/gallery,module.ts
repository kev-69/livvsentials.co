import { Router } from "express";
import { galleryController } from "./gallery.controller";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../../uploads"));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `galleryImage-${Date.now()}-${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

// Tag Management Routes
router.get("/tags", galleryController.getAllTags);
router.post("/tags", galleryController.addTag);
router.put("/tags", galleryController.updateTag);
router.delete("/tags/:tag", galleryController.deleteTag);

// Gallery Item Management Routes
router.get("/items", galleryController.getAllGalleryItems);
router.post("/items", upload.single("image"), galleryController.addGalleryItem);
router.patch("/items/:id", galleryController.updateGalleryItem);
router.delete("/items/:id", galleryController.deleteGalleryItem);

export { router as galleryRoutes };