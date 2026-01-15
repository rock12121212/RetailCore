import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  createVideo,
  deleteVideo,
  getVideoById,
  listVideos,
  updateVideo,
} from './video.controller.js';
import { validateCreateVideo, validateUpdateVideo } from './video.validation.js';

const router = Router();

router.get('/', listVideos);
router.get('/:id', getVideoById);
router.post('/', verifyJWT, validate(validateCreateVideo), createVideo);
router.patch('/:id', verifyJWT, validate(validateUpdateVideo), updateVideo);
router.delete('/:id', verifyJWT, deleteVideo);

export default router;
