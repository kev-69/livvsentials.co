import { Router } from 'express';
import { authController } from './auth.controller';
// import middlewares

const router = Router();

// schema validation
import { authLimiter, sanitizeInput, validate } from './auth.middleware'
import {
    registerSchema,
    loginSchema,
    setNewPasswordSchema,
    // verifyEmailSchema,
} from './auth.schema';

router.post('/register', 
    sanitizeInput,
    validate({ body: registerSchema }), 
    authLimiter,
    authController.register
);

router.post('/login', 
    sanitizeInput,
    validate({ body: loginSchema }),
    authLimiter,
    authController.login
);

// set new password
router.post('/reset-password', 
    sanitizeInput,
    // validate({ body: setNewPasswordSchema }), 
    authController.setNewPassword
);

// get profile
// /auth/me

// update profile
// /auth/update-profile

// forgot password
// /auth/forgot-password

export const authRoutes = router;