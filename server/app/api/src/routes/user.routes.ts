import { Router } from 'express';
import { authRoutes } from '../../../../modules/auth/auth.module';
import { validateToken } from '../../../../middlewares/user.middleware';

const router = Router();

router.use('/auth',
    authRoutes
);

// router.use('/products',
//     productModule,
// )

export { router as userRoutes };