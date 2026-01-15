import { body } from 'express-validator';

export const validateCreateTweet = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 500 })
    .withMessage('Content can be at most 500 characters'),
];
