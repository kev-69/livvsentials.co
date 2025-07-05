import { Request, Response } from "express";
import { checkoutService } from "./checkout.service";
import { AppError } from "../../../utils/errors";
import { errorResponse, successResponse } from "../../../utils/response";
import { PaymentMethod } from "@prisma/client";
import { z } from 'zod';
import crypto from 'crypto';


// Validation schema for initiating payment
const initiatePaymentSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  callbackUrl: z.string().url(),
  metadata: z.record(z.any()).optional()
});

// Validation schema for order creation
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })),
  shippingAddress: z.object({
    fullName: z.string(),
    streetName: z.string(),
    city: z.string(),
    region: z.string(),
    postalCode: z.string(),
    country: z.string().default('Ghana'),
    phone: z.string()
  }),
  paymentMethod: z.nativeEnum(PaymentMethod),
  transactionId: z.string().optional()
});

// PAYSTACK_PUBLIC_KEY should be added to your .env file
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

export const checkoutController = {
  // Get Paystack public key for frontend integration
  getPaystackPublicKey: (req: Request, res: Response) => {
    try {
      if (!PAYSTACK_PUBLIC_KEY) {
        throw new AppError('Paystack public key is not configured', 500);
      }

      res.status(200).json({ publicKey: PAYSTACK_PUBLIC_KEY });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },
  
  // Initialize Paystack payment
  initiatePayment: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const validationResult = initiatePaymentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new AppError('Invalid request data', 400);
      }
      
      const { email, amount, callbackUrl, metadata = {} } = validationResult.data;
      
      // Add user ID to metadata
      const enrichedMetadata = {
        ...metadata,
        userId
      };
      
      const paymentData = await checkoutService.initiatePaystackPayment({
        email,
        amount,
        callbackUrl,
        metadata: enrichedMetadata
      });
      
      res.status(200).json(paymentData);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },
  
  // Verify Paystack payment
  verifyPayment: async (req: Request, res: Response) => {
    try {
      const { reference } = req.params;
      
      if (!reference) {
        throw new AppError('Payment reference is required', 400);
      }
      
      const verification = await checkoutService.verifyPaystackPayment(reference);
      
      res.status(200).json(verification);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        res.status(500).json(errorResponse('An unknown error occurred'));
      }
    }
  },
  
  // Create an order
  createOrder: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const validationResult = createOrderSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        throw new AppError('Invalid request data: ' + JSON.stringify(validationResult.error.errors), 400);
      }
      
      const orderData = validationResult.data;
      
      const result = await checkoutService.createOrder({
        userId,
        ...orderData
      });
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json(errorResponse(error.message));
      } else {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(500).json(errorResponse(errorMessage));
      }
    }
  },
  
  // Paystack webhook handler
  paystackWebhook: async (req: Request, res: Response) => {
    try {
        // Verify the request is from Paystack
        const hash = req.headers['x-paystack-signature'] as string;
        const secretKey = process.env.PAYSTACK_SECRET_KEY!;
        
        if (hash) {
            const signature = crypto
                .createHmac('sha512', secretKey)
                .update(JSON.stringify(req.body))
                .digest('hex');
                
            if (hash !== signature) {
                res.status(200).send('Webhook received');
                return;
            }
        }
        
        const event = req.body;
        
        // Handle different event types
        if (event.event === 'charge.success') {
        const { reference } = event.data;
        
        try {
            // Update payment status
            await checkoutService.updatePaymentStatus(reference, true);
        } catch (error) {
            console.error('Error updating payment status:', error);}
        }
        
        // Always return a 200 to Paystack
        res.status(200).send('Webhook received');
    } catch (error) {
        // Still return 200 to Paystack
        res.status(200).send('Webhook received');
    }
  },
  
  // Handle Paystack callback (redirect from Paystack)
  paystackCallback: async (req: Request, res: Response) => {
    try {
      const { reference } = req.query;
      
      // Redirect the user to the appropriate page based on the transaction status
      res.redirect(`/checkout/status?reference=${reference}`);
    } catch (error) {
      res.redirect('/checkout/status?status=error');
    }
  }
};