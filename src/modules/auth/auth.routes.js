import { Router } from 'express';
import { login, register, logout, refresh } from './auth.controller.js';
import { validateRegister, validateLogin } from './auth.validation.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';

const router = Router();

router.post(
  '/register',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  validate(validateRegister),
  register
);
router.post('/login', validate(validateLogin), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
