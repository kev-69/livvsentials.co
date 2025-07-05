import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from "../../../shared/prisma";
import logger from "../../../utils/logger";
import { AppError } from "../../../utils/errors";
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';

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

const verificationCache = new Map<string, {
  timestamp: number;
  result: any;
}>();

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
        // Check if we have a cached result less than 5 minutes old
        const cached = verificationCache.get(reference);
        if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        logger.info(`Using cached verification result for reference: ${reference}`);
        return cached.result;
        }

        // Add a timeout to the axios request
        const response = await axios.get(
        `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        {
            headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
        }
        );
        
        let result;
        if (response.data.status && response.data.data.status === 'success') {
        result = {
            verified: true,
            data: response.data.data
        };
        } else {
        result = {
            verified: false,
            data: response.data.data
        };
        }

        // Cache the result
        verificationCache.set(reference, {
        timestamp: Date.now(),
        result
        });
        
        return result;
    } catch (error: any) {
        // Check if we already have a cached result to use as fallback
        const cached = verificationCache.get(reference);
        if (cached) {
        logger.warn(`Using cached verification as fallback for reference: ${reference} due to API error`);
        return cached.result;
        }

        // More detailed error logging
        if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.error(`Paystack verification API error: ${error.response.status}`, 
            error.response.data);
        } else if (error.request) {
        // The request was made but no response was received
        logger.error(`Paystack verification timeout/network error: ${error.message}`);
        } else {
        // Something happened in setting up the request that triggered an Error
        logger.error(`Paystack verification error: ${error.message}`);
        }
        
        throw new AppError("Failed to verify payment. Please try again later.", 500);
    }
    },
  
    // Find existing payment by transaction ID
    findExistingPayment: async (transactionId: string) => {
        try {
        const payment = await prisma.payment.findUnique({
            where: { transactionId },
            include: {
            order: {
                include: {
                orderItems: true,
                }
            }
            }
        });
        
        return payment;
        } catch (error) {
        logger.error("Error finding existing payment:", error);
        return null;
        }
    },
    
    // Create an order in the database
    createOrder: async (input: CreateOrderInput) => {
        const { userId, items, shippingAddress, paymentMethod, transactionId } = input;
        
        try {
            // Check if a payment with this transaction ID already exists
            if (transactionId) {
                const existingPayment = await checkoutService.findExistingPayment(transactionId);
                
                if (existingPayment) {
                    logger.info(`Found existing payment with transaction ID ${transactionId}`);
                    
                    // Return the existing payment and order
                    return {
                        order: existingPayment.order,
                        payment: existingPayment
                    };
                }
            }
            
            // For Paystack payments, verify the payment first before proceeding
            let paymentVerified = false;
            if (paymentMethod === PaymentMethod.PAYSTACK && transactionId) {
                try {
                    const verification = await checkoutService.verifyPaystackPayment(transactionId);
                    paymentVerified = verification.verified;
                    
                    // If payment is not verified, don't proceed with order creation
                    if (!paymentVerified) {
                        throw new AppError("Payment verification failed. Cannot create order.", 400);
                    }
                } catch (error) {
                    logger.error("Failed to verify Paystack payment:", error);
                    throw new AppError("Payment verification failed. Cannot create order.", 400);
                }
            } else if (paymentMethod === PaymentMethod.PAYSTACK) {
                // If payment method is Paystack but no transaction ID, can't proceed
                throw new AppError("Transaction ID is required for Paystack payments", 400);
            }
            
            // Start a transaction to ensure data consistency
            try {
                return await prisma.$transaction(async (tx) => {
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
                    
                    // 4. Determine order and payment status based on payment verification
                    const orderStatus = paymentVerified ? OrderStatus.PROCESSING : OrderStatus.CANCELLED;
                    const paymentStatus = paymentVerified ? PaymentStatus.COMPLETED : PaymentStatus.CANCELLED;
                    
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
                    
                    // 7. Create payment record, handling unique constraint errors
                    let payment;
                    try {
                        if (transactionId) {
                            // Double-check if a payment with this transaction ID was created concurrently
                            const existingPayment = await checkoutService.findExistingPayment(transactionId);
                            if (existingPayment) {
                                // We have a race condition where payment was created after our initial check
                                // Clean up the order we just created and return the existing data
                                await tx.order.delete({ where: { id: order.id } });
                                return {
                                    order: existingPayment.order,
                                    payment: existingPayment
                                };
                            }
                            
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
                            // Create payment without transaction ID
                            payment = await tx.payment.create({
                                data: {
                                    orderId: order.id,
                                    amount: totalAmount,
                                    paymentMethod,
                                    paymentStatus
                                }
                            });
                        }
                    } catch (e) {
                        if (e instanceof Prisma.PrismaClientKnownRequestError) {
                            // If this is a unique constraint error on transactionId
                            if (e.code === 'P2002' && Array.isArray(e.meta?.target) && (e.meta?.target as string[]).includes('transactionId')) {
                                // Fetch the existing payment 
                                const existingPayment = await checkoutService.findExistingPayment(transactionId!);
                                if (existingPayment) {
                                    // Clean up the order we just created
                                    await tx.order.delete({ where: { id: order.id } });
                                    return {
                                        order: existingPayment.order,
                                        payment: existingPayment
                                    };
                                }
                            }
                        }
                        throw e; // Re-throw if it's not a constraint error or we can't find the existing payment
                    }
                    
                    // 8. If payment is verified, update inventory
                    if (paymentVerified) {
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
                });
            } catch (error) {
                // Handle transaction errors
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    // If this is a unique constraint error on transactionId
                    if (error.code === 'P2002' && Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes('transactionId')) {
                        logger.info(`Payment with transaction ID ${transactionId} already exists. Fetching existing data.`);
                        
                        // Fetch the existing payment and return it
                        const existingPayment = await checkoutService.findExistingPayment(transactionId!);
                        if (existingPayment) {
                            return {
                                order: existingPayment.order,
                                payment: existingPayment
                            };
                        }
                    }
                }
                
                // Re-throw for other errors
                logger.error("Transaction error:", error);
                throw error;
            }
        } catch (error) {
            logger.error("Error creating order:", error);
            
            // Special handling for unique constraint errors at the outer level
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002' && Array.isArray(error.meta?.target) && (error.meta?.target as string[]).includes('transactionId')) {
                    const existingPayment = await checkoutService.findExistingPayment(transactionId!);
                    if (existingPayment) {
                        return {
                            order: existingPayment.order,
                            payment: existingPayment
                        };
                    }
                }
            }
            
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