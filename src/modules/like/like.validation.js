import { body } from 'express-validator';

export const validateCreateLike = [
  body('videoId')
    .optional()
    .trim()
    .isMongoId()
    .withMessage('Video ID must be a valid ID'),

  body('commentId')
    .optional()
    .trim()
    .isMongoId()
    .withMessage('Comment ID must be a valid ID'),

  body('tweetId')
    .optional()
    .trim()
    .isMongoId()
    .withMessage('Tweet ID must be a valid ID'),
];
