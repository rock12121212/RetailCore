import { Router } from 'express';
import { login, register, logout } from './auth.controller.js';
import { validateRegister, validateLogin } from './auth.validation.js';
import { validate } from '../../middlewares/validation.middleware.js';

const router = Router();

router.post('/register', validate(validateRegister), register);
router.post('/login', validate(validateLogin), login);
router.post('/logout', logout);

export default router;
