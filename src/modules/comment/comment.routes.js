import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createComment, deleteComment, listCommentsByVideo } from './comment.controller.js';
import { validateCreateComment } from './comment.validation.js';

const router = Router();

router.get('/video/:videoId', listCommentsByVideo);
router.post('/', verifyJWT, validate(validateCreateComment), createComment);
router.delete('/:id', verifyJWT, deleteComment);

export default router;
