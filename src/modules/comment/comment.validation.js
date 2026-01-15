import { body } from 'express-validator';

export const validateCreateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 2000 })
    .withMessage('Content can be at most 2000 characters'),

  body('videoId')
    .trim()
    .notEmpty()
    .withMessage('Video ID is required')
    .isMongoId()
    .withMessage('Video ID must be a valid ID'),
];
