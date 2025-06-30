import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();

// schema validation
import { authLimiter, sanitizeInput, validate } from './auth.middleware'
import {
    registerSchema,
    loginSchema,
    setNewPasswordSchema,
    // verifyEmailSchema,
} from './auth.schema';
import { validateToken } from '../../../middlewares/user.middleware';

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

router.get('/me',
    validateToken,
    authController.getUserProfile
)

// update profile
router.patch('/update-profile', 
    sanitizeInput,
    validateToken,
    authController.updateProfile
);

// change password
router.patch('/change-password', 
    sanitizeInput,
    validateToken,
    authController.changePassword
);

// set new password
// router.post('/reset-password', 
//     sanitizeInput,
//     // validate({ body: setNewPasswordSchema }), 
//     authController.setNewPassword
// );

// request password reset
// /auth/request-password-reset

export const authRoutes = router;