import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  addReply,
  createComment,
  deleteComment,
  getReplies,
  listCommentsByVideo,
} from './comment.controller.js';
import { validateAddReply, validateCreateComment } from './comment.validation.js';

const router = Router();

router.get('/video/:videoId', listCommentsByVideo);
router.post('/', verifyJWT, validate(validateCreateComment), createComment);
router.get('/replies/:commentId', getReplies);
router.post('/reply/:commentId', verifyJWT, validate(validateAddReply), addReply);
router.delete('/:id', verifyJWT, deleteComment);

export default router;
