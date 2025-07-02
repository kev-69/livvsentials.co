import { Request, Response } from "express";
import { cartService } from "./cart.service";
import { AppError } from "../../../utils/errors";
import { successResponse } from "../../../utils/response";
import logger from "../../../utils/logger";

export const cartController = {
  /**
   * Get the current user's cart
   */
  getCart: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId;
      
      // Get or create cart
      const result = await cartService.getOrCreateCart(userId, sessionId);
      
      if (!result || !result.cart) {
        throw new AppError("Failed to get or create cart", 500);
      }
      
      const { cart, sessionId: newSessionId, isNew } = result;
      
      // Set session cookie if it's new
      if (isNew && newSessionId && !userId) {
        res.cookie("cartSessionId", newSessionId, { 
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: 'lax'
        });
      }
      
      // Get formatted cart data
      const cartData = await cartService.getCart(cart.id);
      
      res.status(200).json(cartData);
    } catch (error) {
      logger.error('Error in getCart controller:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to get cart', 500);
    }
  },

  /**
   * Add an item to the cart
   */
  addToCart: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId;
      const { productId, quantity = 1 } = req.body;
      
      if (!productId) {
        throw new AppError("Product ID is required", 400);
      }
      
      // Get or create cart
      const result = await cartService.getOrCreateCart(userId, sessionId);
      
      if (!result || !result.cart) {
        throw new AppError("Failed to get or create cart", 500);
      }
      
      const { cart, sessionId: newSessionId, isNew } = result;
      
      // Set session cookie if it's new
      if (isNew && newSessionId && !userId) {
        res.cookie("cartSessionId", newSessionId, { 
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: 'lax'
        });
      }
      
      // Add item to cart
      await cartService.addToCart(cart.id, productId, quantity);
      
      // Get updated cart
      const updatedCart = await cartService.getCart(cart.id);
      
      res.status(200).json(updatedCart);
    } catch (error) {
      logger.error('Error in addToCart controller:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to add item to cart', 500);
    }
  },

  /**
   * Update an item quantity in the cart
   */
  updateCartItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId;
      const productId = req.params.productId;
      const { quantity } = req.body;
      
      if (!productId || !quantity) {
        throw new AppError("Product ID and quantity are required", 400);
      }
      
      // Get cart
      const result = await cartService.getOrCreateCart(userId, sessionId);
      
      if (!result || !result.cart) {
        throw new AppError("Failed to get or create cart", 500);
      }
      
      const { cart } = result;
      
      // Update cart item
      await cartService.updateCartItem(cart.id, productId, quantity);
      
      // Get updated cart
      const updatedCart = await cartService.getCart(cart.id);
      
      res.status(200).json(updatedCart);
    } catch (error) {
      logger.error('Error in updateCartItem controller:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update cart item', 500);
    }
  },

  /**
   * Remove an item from the cart
   */
  removeFromCart: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId;
      const productId = req.params.productId;
      
      if (!productId) {
        throw new AppError("Product ID is required", 400);
      }
      
      // Get cart
      const result = await cartService.getOrCreateCart(userId, sessionId);
      
      if (!result || !result.cart) {
        throw new AppError("Failed to get or create cart", 500);
      }
      
      const { cart } = result;
      
      // Remove item from cart
      await cartService.removeFromCart(cart.id, productId);
      
      // Get updated cart
      const updatedCart = await cartService.getCart(cart.id);
      
      res.status(200).json(updatedCart);
    } catch (error) {
      logger.error('Error in removeFromCart controller:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to remove item from cart', 500);
    }
  },

  /**
   * Clear all items from the cart
   */
  clearCart: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId;
      
      // Get cart
      const result = await cartService.getOrCreateCart(userId, sessionId);
      
      if (!result || !result.cart) {
        throw new AppError("Failed to get or create cart", 500);
      }
      
      const { cart } = result;
      
      // Clear the cart
      await cartService.clearCart(cart.id);
      
      // Get empty cart
      const emptyCart = await cartService.getCart(cart.id);
      
      res.status(200).json(emptyCart);
    } catch (error) {
      logger.error('Error in clearCart controller:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to clear cart', 500);
    }
  },

  /**
   * Transfer a guest cart to a user after login
   */
  transferGuestCart: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const sessionId = req.cookies?.cartSessionId;
      
      if (!userId || !sessionId) {
        throw new AppError("User ID and session ID are required", 400);
      }
      
      // Transfer cart
      await cartService.transferGuestCart(sessionId, userId);
      
      // Clear session cookie
      res.clearCookie("cartSessionId");
      
      res.status(200).json(successResponse("Cart transferred successfully"));
    } catch (error) {
      logger.error('Error in transferGuestCart controller:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to transfer cart', 500);
    }
  }
};