import { Router } from 'express';
import { login, register, logout } from './auth.controller.js';
// import { validateRegister, validateLogin } from './auth.validation.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
