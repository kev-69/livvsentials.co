import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";
import { AppError } from "../../../utils/errors";
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

// Set up Paystack environment variables
// NOTE: Add these to your .env file:
// PAYSTACK_SECRET_KEY=your_paystack_secret_key
// PAYSTACK_PUBLIC_KEY=your_paystack_public_key
// PAYSTACK_BASE_URL=https://api.paystack.co

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  logger.error('PAYSTACK_SECRET_KEY is not defined in environment variables');
}

// Function to generate a unique order number
const generateOrderNumber = () => {
  // Format: ORD-YYYYMMDD-RANDOM
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
};

interface CreateOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: any; // Will be stored as JSON in the database
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

interface InitiatePaystackPaymentInput {
  email: string;
  amount: number;
  reference?: string;
  callbackUrl: string;
  metadata: Record<string, any>;
}

export const checkoutService = {
  // Initialize Paystack payment
  initiatePaystackPayment: async (input: InitiatePaystackPaymentInput) => {
    try {
      // Generate a unique reference if not provided
      const reference = input.reference || `PAY-${uuidv4()}`;
      
      // Convert amount to kobo (Paystack expects amount in the smallest currency unit)
      const amountInKobo = Math.round(input.amount * 100);
      
      const response = await axios.post(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          email: input.email,
          amount: amountInKobo,
          reference,
          callback_url: input.callbackUrl,
          metadata: input.metadata
        },
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status) {
        return response.data.data;
      } else {
        throw new AppError(`Paystack payment initialization failed: ${response.data.message}`, 400);
      }
    } catch (error: any) {
      logger.error("Paystack payment initialization error:", error.response?.data || error.message);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to initialize payment", 500);
    }
  },
  
  // Verify Paystack payment
  verifyPaystackPayment: async (reference: string) => {
    try {
      const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status && response.data.data.status === 'success') {
        return {
          verified: true,
          data: response.data.data
        };
      } else {
        return {
          verified: false,
          data: response.data.data
        };
      }
    } catch (error: any) {
      logger.error("Paystack payment verification error:", error.response?.data || error.message);
      throw new AppError("Failed to verify payment", 500);
    }
  },
  
  // Create an order in the database
  createOrder: async (input: CreateOrderInput) => {
    const { userId, items, shippingAddress, paymentMethod, transactionId } = input;
    
    try {
        // Check if a payment with this transaction ID already exists
        if (transactionId) {
            const existingPayment = await prisma.payment.findUnique({
                where: { transactionId }
            });
            
            if (existingPayment) {
                // Payment already exists, find the corresponding order
                const existingOrder = await prisma.order.findUnique({
                    where: { id: existingPayment.orderId },
                    include: {
                        orderItems: true,
                        payments: true
                    }
                });
                
                if (existingOrder) {
                    // Return the existing order and payment
                    return {
                        order: existingOrder,
                        payment: existingPayment
                    };
                }
            }
        }
        
        // Start a transaction to ensure data consistency
        return await prisma.$transaction(async (tx) => {
        try {
            // 1. Generate a unique order number
            const orderNumber = generateOrderNumber();
            
            // 2. Fetch the products to get their prices and check availability
            const productIds = items.map(item => item.productId);
            const products = await tx.product.findMany({
            where: {
                id: { in: productIds },
                inStock: true
            }
            });
            
            // Check if all products are found and in stock
            if (products.length !== productIds.length) {
            const foundIds = products.map(p => p.id);
            const missingIds = productIds.filter(id => !foundIds.includes(id));
            throw new AppError(`Some products were not found or are out of stock: ${missingIds.join(', ')}`, 400);
            }
            
            // 3. Calculate the total order amount and prepare order items
            let totalAmount = 0;
            const orderItems = items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new AppError(`Product with ID ${item.productId} not found`, 400);
            }
            
            // Check if enough stock is available
            if (product.stockQuantity < item.quantity) {
                throw new AppError(`Not enough stock for ${product.name}. Only ${product.stockQuantity} available.`, 400);
            }
            
            // Use sale price if available, otherwise use regular price
            const price = product.salePrice || product.price;
            totalAmount += price * item.quantity;
            
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: price
            };
            });
            
            // 4. Determine order and payment status based on payment method
            let orderStatus = OrderStatus.PROCESSING;
            let paymentStatus = PaymentStatus.PROCESSING;
            
           if (paymentMethod === 'PAYSTACK' && transactionId) {
            // Verify the payment if it's done via Paystack
            try {
                const verification = await this.verifyPaystackPayment(transactionId);
                if (verification.verified) {
                paymentStatus = PaymentStatus.COMPLETED;
                }
            } catch (error) {
                logger.error("Error verifying Paystack payment:", error);
                // Continue with the order creation, but mark payment as processing
            }
            }
            
            // 5. Create the order record
            const order = await tx.order.create({
            data: {
                orderNumber,
                userId,
                totalAmount,
                orderStatus,
                shippingAddress: JSON.stringify(shippingAddress),
                products: {
                connect: productIds.map(id => ({ id }))
                }
            },
            include: {
                orderItems: true
            }
            });
            
            // 6. Create order items
            await Promise.all(orderItems.map(item => 
            tx.orderItem.create({
                data: {
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
                }
            })
            ));
            
            // 7. Create payment record
            let payment;
            if (transactionId) {
                payment = await tx.payment.create({
                    data: {
                        orderId: order.id,
                        amount: totalAmount,
                        transactionId,
                        paymentMethod,
                        paymentStatus
                    }
                });
            } else {
                // Create payment without transaction ID if none provided
                payment = await tx.payment.create({
                    data: {
                        orderId: order.id,
                        amount: totalAmount,
                        paymentMethod,
                        paymentStatus
                    }
                });
            }
            
            // 8. If payment is completed, update inventory
            if (paymentStatus === PaymentStatus.COMPLETED) {
                await Promise.all(orderItems.map(item => 
                    tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stockQuantity: {
                        decrement: item.quantity
                        },
                        inStock: {
                        set: (products.find(p => p.id === item.productId)!.stockQuantity - item.quantity) > 0
                        }
                    }
                    })
                ));
            }
            
            return {
                order,
                payment
            };
        } catch (error) {
            // This will trigger a rollback
            logger.error("Transaction error:", error);
            throw error;
        }
        });
    } catch (error) {
        logger.error("Error creating order:", error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Failed to create order", 500);
    }
  },
  
  // Update payment status after verification
  updatePaymentStatus: async (transactionId: string, verified: boolean) => {
    try {
      // Find the payment by transaction ID
      const payment = await prisma.payment.findUnique({
        where: { transactionId },
        include: { order: true }
      });
      
      if (!payment) {
        throw new AppError('Payment not found', 404);
      }
      
      // Update the payment status
      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: verified ? PaymentStatus.COMPLETED : PaymentStatus.CANCELLED
        }
      });
      
      // If payment is verified, update related order and inventory
      if (verified) {
        const order = await prisma.order.update({
          where: { id: payment.orderId },
          data: {
            orderStatus: OrderStatus.PROCESSING
          },
          include: {
            orderItems: true
          }
        });
        
        // Update inventory (reduce stock)
        for (const item of order.orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity
              },
              // Update stock status if quantity reaches zero
              inStock: {
                set: (await prisma.product.findUnique({ 
                  where: { id: item.productId } 
                }))!.stockQuantity - item.quantity > 0
              }
            }
          });
        }
      } else {
        // If payment failed, update order status
        await prisma.order.update({
          where: { id: payment.orderId },
          data: {
            orderStatus: OrderStatus.CANCELLED
          }
        });
      }
      
      return updatedPayment;
    } catch (error) {
      logger.error("Error updating payment status:", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to update payment status", 500);
    }
  }
};