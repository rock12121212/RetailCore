import { body } from 'express-validator';

export const validateCreateSubscription = [
  body('channelId')
    .trim()
    .notEmpty()
    .withMessage('Channel ID is required')
    .isMongoId()
    .withMessage('Channel ID must be a valid ID'),
];
