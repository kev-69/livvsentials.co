import { Router } from "express";
import { validateToken, optionalToken } from "../../../middlewares/user.middleware";
import { cartController } from "./cart.controller";

const router = Router();

// Public routes (accessible with or without login)
router.get('/', optionalToken, cartController.getCart);
router.post('/add', optionalToken, cartController.addToCart);
router.put('/update/:productId', optionalToken, cartController.updateCartItem);
router.delete('/remove/:productId', optionalToken, cartController.removeFromCart);
router.delete('/clear', optionalToken, cartController.clearCart);

// Auth-required routes
router.post('/transfer', validateToken, cartController.transferGuestCart);

export const cartRoutes = router;