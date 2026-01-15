import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import { createTweet, deleteTweet, listTweets } from './tweet.controller.js';
import { validateCreateTweet } from './tweet.validation.js';

const router = Router();

router.get('/', listTweets);
router.post('/', verifyJWT, validate(validateCreateTweet), createTweet);
router.delete('/:id', verifyJWT, deleteTweet);

export default router;
