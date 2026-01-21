import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createLike, deleteLike, getLikeStats, toggleLike } from './like.controller.js';
import { validateCreateLike } from './like.validation.js';

const router = Router();

router.get('/stats', verifyJWT, getLikeStats);
router.post('/toggle', verifyJWT, toggleLike);
router.post('/', verifyJWT, validate(validateCreateLike), createLike);
router.delete('/:id', verifyJWT, deleteLike);

export default router;
