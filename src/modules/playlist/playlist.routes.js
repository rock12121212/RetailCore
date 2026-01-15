import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  listPlaylists,
  updatePlaylist,
} from './playlist.controller.js';
import { validateCreatePlaylist, validateUpdatePlaylist } from './playlist.validation.js';

const router = Router();

router.get('/', listPlaylists);
router.get('/:id', getPlaylistById);
router.post('/', verifyJWT, validate(validateCreatePlaylist), createPlaylist);
router.patch('/:id', verifyJWT, validate(validateUpdatePlaylist), updatePlaylist);
router.delete('/:id', verifyJWT, deletePlaylist);

export default router;
