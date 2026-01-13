import { Router } from 'express';

// Import module routes
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';

const router = Router();

// Register module routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
