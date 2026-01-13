import { Router } from 'express';
import { getCurrentUser, updateProfile } from './user.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Secure routes
router.use(verifyJWT);

router.get('/me', getCurrentUser);
router.patch('/profile', updateProfile);

export default router;
