import { Router } from 'express';
import { getCurrentUser, updateProfile } from './user.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validateUpdateProfile } from './user.validation.js';
import { validate } from '../../middlewares/validation.middleware.js';

const router = Router();

// Secure routes
router.use(verifyJWT);

router.get('/me', getCurrentUser);
router.patch('/profile', validate(validateUpdateProfile), updateProfile);

export default router;
