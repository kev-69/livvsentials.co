import { Router } from "express";
import { checkoutController } from "./checkout.controller";
import { validateToken } from "../../../middlewares/user.middleware";

const router = Router();

// Get Paystack public key
router.get("/paystack-key", 
  checkoutController.getPaystackPublicKey
);

// Initiate a payment
router.post("/initiate-payment", 
  validateToken,
  checkoutController.initiatePayment
);

// Verify a payment
router.get("/verify-payment/:reference", 
  validateToken,
  checkoutController.verifyPayment
);

// Create an order
router.post("/orders", 
  validateToken,
  checkoutController.createOrder
);

// Paystack webhook (doesn't need authentication)
router.post("/webhook/paystack", 
  checkoutController.paystackWebhook
);

// Paystack callback URL
router.get("/paystack-callback", 
  checkoutController.paystackCallback
);

export const checkoutRoutes = router;