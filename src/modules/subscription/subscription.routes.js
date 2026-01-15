import { Router } from 'express';
import { verifyJWT } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validation.middleware.js';
import {
  createSubscription,
  deleteSubscription,
  listSubscriptions,
} from './subscription.controller.js';
import { validateCreateSubscription } from './subscription.validation.js';

const router = Router();

router.get('/', listSubscriptions);
router.post('/', verifyJWT, validate(validateCreateSubscription), createSubscription);
router.delete('/channel/:channelId', verifyJWT, deleteSubscription);

export default router;
