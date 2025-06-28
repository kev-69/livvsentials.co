import { Router } from "express";
import multer from "multer";
import path from "path";

import { authController, loginAdmin } from "./auth.controller";
import { isAdmin, validateToken } from "../../../middlewares/admin.middleware";

const router = Router();

// Configure multer for temporary storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../temp"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any, false);
    }
  }
});

router.post('/login',
    loginAdmin
)

router.get('/profile',
    validateToken,
    isAdmin,
    authController.fetchProfile
)

router.post('/reset-password',
    validateToken,
    isAdmin,
    authController.changePassword
)

router.put('/profile',
    validateToken,
    isAdmin,
    upload.single('profilePhoto'), // Add multer middleware
    authController.updateProfile
)

export { router as authRoutes };