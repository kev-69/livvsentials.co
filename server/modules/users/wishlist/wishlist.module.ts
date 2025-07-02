import { Router } from "express";
import { wishlistController } from "./wishlist.controller";
import { validateToken } from "../../../middlewares/user.middleware";

const router = Router();

// Get all wishlist items
router.get('/',
    validateToken,
    wishlistController.getWishlist
);

// Add to wishlist (changing to POST with product ID in body)
router.post('/',
    validateToken,
    wishlistController.addToWishlist
);

// Remove from wishlist by product ID
router.delete('/:productId',
    validateToken,
    wishlistController.removeFromWishlist
);

export { router as wishlistRoutes };