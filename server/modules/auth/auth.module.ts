import { Router } from 'express';
import { authController } from './auth.controller';
// import middlewares

const router = Router();

// schema validation
import { authLimiter, isAuthenticated, sanitizeInput, validate } from './auth.middleware'
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
    // isAuthenticated,
    authLimiter,
    authController.login
);

// reset password

// set new password
router.post('/set-new-password', 
    sanitizeInput,
    // validate({ body: setNewPasswordSchema }), 
    authController.setNewPassword
);

export const authRoutes = router;