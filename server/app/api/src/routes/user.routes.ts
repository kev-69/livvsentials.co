import { Router } from 'express';
import { authRoutes } from '../../../../modules/auth/auth.module';

const router = Router();

router.use('/auth', authRoutes);

export { router as userRoutes };