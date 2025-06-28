import { Router } from 'express';
import { authRoutes } from '../../../../modules/users/auth/auth.module';
import { validateToken } from '../../../../middlewares/user.middleware';
import { getSettingsRoutes } from '../../../../modules/users/platform/platform.module';

const router = Router();

router.use('/auth',
    authRoutes
);

// platform routes
router.use('/settings',
    getSettingsRoutes
)

// all other routes that require validation and authentication


export { router as userRoutes };