import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";
import { v4 as uuidv4 } from 'uuid';

export const cartService = {
  /**
   * Get or create a cart for a user or session
   * This supports both authenticated users and guests with session IDs
   */
  async getOrCreateCart(userId?: string, sessionId?: string) {
    try {
      // Case 1: No user ID or session ID provided (new guest)
      if (!userId && !sessionId) {
        // Generate a new session ID
        sessionId = uuidv4();
        
        // Create a new cart with the session ID
        const newCart = await prisma.cart.create({
          data: { sessionId },
          include: { cartItems: true }
        });
        
        return { 
          cart: newCart, 
          sessionId, 
          isNew: true 
        };
      }
      
      // Case 2: User is logged in
      if (userId) {
        // Try to find user's existing cart
        let cart = await prisma.cart.findFirst({
          where: { userId },
          include: { 
            cartItems: { 
              include: { 
                product: {
                  include: {
                    category: true
                  }
                } 
              } 
            }
          }
        });
        
        // If user has a cart but also has a session cart, merge them
        if (sessionId) {
          const sessionCart = await prisma.cart.findUnique({
            where: { sessionId },
            include: { cartItems: true }
          });
          
          if (sessionCart) {
            // If user doesn't have a cart yet, convert session cart to user cart
            if (!cart) {
              cart = await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId },
                include: { 
                  cartItems: { 
                    include: { 
                      product: {
                        include: {
                          category: true
                        }
                      } 
                    } 
                  }
                }
              });
            } 
            // If user has a cart and a session cart, merge items
            else if (sessionCart.cartItems.length > 0) {
              // Merge session cart items into user cart
              for (const item of sessionCart.cartItems) {
                // Check if item already exists in user cart
                const existingItem = await prisma.cartItem.findUnique({
                  where: {
                    cartId_productId: {
                      cartId: cart.id,
                      productId: item.productId
                    }
                  }
                });
                
                if (existingItem) {
                  // Update quantity of existing item
                  await prisma.cartItem.update({
                    where: {
                      cartId_productId: {
                        cartId: cart.id,
                        productId: item.productId
                      }
                    },
                    data: { quantity: existingItem.quantity + item.quantity }
                  });
                } else {
                  // Add new item to user cart
                  await prisma.cartItem.create({
                    data: {
                      cartId: cart.id,
                      productId: item.productId,
                      quantity: item.quantity
                    }
                  });
                }
              }
              
              // Delete the session cart after merging
              await prisma.cart.delete({ where: { id: sessionCart.id } });
            }
          }
        }
        
        // If user still doesn't have a cart, create one
        if (!cart) {
          cart = await prisma.cart.create({
            data: { userId },
            include: { 
              cartItems: { 
                include: { 
                  product: {
                    include: {
                      category: true
                    }
                  } 
                } 
              }
            }
          });
        }
        
        // Refresh cart to get latest data
        cart = await prisma.cart.findUnique({
          where: { id: cart.id },
          include: { 
            cartItems: { 
              include: { 
                product: {
                  include: {
                    category: true
                  }
                } 
              } 
            }
          }
        });
        
        return { cart, sessionId: null, isNew: false };
      }
      
      // Case 3: Session ID exists (returning guest)
      if (sessionId) {
        // Find cart by session ID
        let cart = await prisma.cart.findUnique({
          where: { sessionId },
          include: { 
            cartItems: { 
              include: { 
                product: {
                  include: {
                    category: true
                  }
                } 
              } 
            }
          }
        });
        
        // If session cart doesn't exist, create a new one
        if (!cart) {
          cart = await prisma.cart.create({
            data: { sessionId },
            include: { 
              cartItems: { 
                include: { 
                  product: {
                    include: {
                      category: true
                    }
                  } 
                } 
              }
            }
          });
          return { cart, sessionId, isNew: true };
        }
        
        return { cart, sessionId, isNew: false };
      }
      
      // This should never happen due to our checks, but just in case
      throw new Error("Neither userId nor sessionId provided");
      
    } catch (error) {
      logger.error('Error in getOrCreateCart:', error);
      throw error;
    }
  },

  /**
   * Add a product to a cart
   */
  async addToCart(cartId: string, productId: string, quantity: number) {
    try {
      // Check if product exists and has enough stock
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true }
      });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (!product.inStock || product.stockQuantity < quantity) {
        throw new Error('Not enough stock available');
      }
      
      // Check if item is already in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        }
      });
      
      let cartItem;
      
      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        // Check if new quantity exceeds stock
        if (newQuantity > product.stockQuantity) {
          throw new Error('Cannot add more of this item (exceeds available stock)');
        }
        
        // Update cart item
        cartItem = await prisma.cartItem.update({
          where: {
            cartId_productId: {
              cartId,
              productId
            }
          },
          data: {
            quantity: newQuantity
          },
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        });
      } else {
        // Add new item to cart
        cartItem = await prisma.cartItem.create({
          data: {
            cartId,
            productId,
            quantity
          },
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        });
      }
      
      // Format the cart item response
      return {
        productId: cartItem.product.id,
        productName: cartItem.product.name,
        quantity: cartItem.quantity,
        price: cartItem.product.salePrice || cartItem.product.price,
        total: (cartItem.product.salePrice || cartItem.product.price) * cartItem.quantity,
        product: cartItem.product
      };
      
    } catch (error) {
      logger.error('Error in addToCart:', error);
      throw error;
    }
  },

  /**
   * Update the quantity of a cart item
   */
  async updateCartItem(cartId: string, productId: string, quantity: number) {
    try {
      // Check if item exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        }
      });
      
      if (!existingItem) {
        throw new Error('Item not found in cart');
      }
      
      // Check if product exists and has enough stock
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (!product.inStock) {
        throw new Error('Product is out of stock');
      }
      
      // Check if new quantity exceeds stock
      if (quantity > product.stockQuantity) {
        throw new Error('Cannot update item (exceeds available stock)');
      }
      
      // Update cart item
      const updatedItem = await prisma.cartItem.update({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        },
        data: { quantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      });
      
      return {
        productId: updatedItem.product.id,
        productName: updatedItem.product.name,
        quantity: updatedItem.quantity,
        price: updatedItem.product.salePrice || updatedItem.product.price,
        total: (updatedItem.product.salePrice || updatedItem.product.price) * updatedItem.quantity,
        product: updatedItem.product
      };
      
    } catch (error) {
      logger.error('Error in updateCartItem:', error);
      throw error;
    }
  },

  /**
   * Remove an item from a cart
   */
  async removeFromCart(cartId: string, productId: string) {
    try {
      // Check if item exists in cart
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        }
      });
      
      if (!existingItem) {
        throw new Error('Item not found in cart');
      }
      
      // Remove item from cart
      await prisma.cartItem.delete({
        where: {
          cartId_productId: {
            cartId,
            productId
          }
        }
      });
      
      return { success: true, message: 'Item removed from cart' };
      
    } catch (error) {
      logger.error('Error in removeFromCart:', error);
      throw error;
    }
  },

  /**
   * Get cart with formatted data
   */
  async getCart(cartId: string) {
    try {
      // Fetch cart with items and product details
      const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      });
      
      if (!cart) {
        throw new Error('Cart not found');
      }
      
      // Calculate total price
      const subtotal = cart.cartItems.reduce((acc, item) => {
        const itemPrice = (item.product.salePrice || item.product.price) * item.quantity;
        return acc + itemPrice;
      }, 0);
      
      // Format cart items
      const formattedItems = cart.cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
        total: (item.product.salePrice || item.product.price) * item.quantity,
        product: item.product // Include full product data for frontend
      }));
      
      // Return formatted cart
      return {
        id: cart.id,
        userId: cart.userId,
        sessionId: cart.sessionId,
        cartItems: formattedItems,
        subtotal,
        itemCount: formattedItems.length,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      };
      
    } catch (error) {
      logger.error('Error in getCart:', error);
      throw error;
    }
  },

  /**
   * Clear all items from a cart
   */
  async clearCart(cartId: string) {
    try {
      // Check if cart exists
      const cart = await prisma.cart.findUnique({
        where: { id: cartId }
      });
      
      if (!cart) {
        throw new Error('Cart not found');
      }
      
      // Delete all items in the cart
      await prisma.cartItem.deleteMany({
        where: { cartId }
      });
      
      return { success: true, message: 'Cart cleared successfully' };
      
    } catch (error) {
      logger.error('Error in clearCart:', error);
      throw error;
    }
  },

  /**
   * Transfer a guest cart to a user after login
   */
  async transferGuestCart(sessionId: string, userId: string) {
    try {
      if (!sessionId || !userId) {
        throw new Error('Session ID and User ID are required');
      }
      
      const result = await this.getOrCreateCart(userId, sessionId);
    
      if (!result || !result.cart) {
        throw new Error('Failed to get or create cart');
      }
    
      return { success: true, cartId: result.cart.id };
    } catch (error) {
      logger.error('Error in transferGuestCart:', error);
      throw error;
    }
  },

  /**
   * Clean up old guest carts (should be run periodically)
   */
  async cleanupOldCarts(days: number = 30) {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);
      
      // Find and delete old guest carts
      const oldCarts = await prisma.cart.findMany({
        where: {
          userId: null,
          updatedAt: {
            lt: date
          }
        }
      });
      
      for (const cart of oldCarts) {
        // Delete cart items first
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id }
        });
        
        // Then delete the cart
        await prisma.cart.delete({
          where: { id: cart.id }
        });
      }
      
      return { success: true, count: oldCarts.length };
      
    } catch (error) {
      logger.error('Error in cleanupOldCarts:', error);
      throw error;
    }
  }
};