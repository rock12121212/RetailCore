import { body } from 'express-validator';

export const validateCreatePlaylist = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name can be at most 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description can be at most 2000 characters'),

  body('videos')
    .optional()
    .isArray()
    .withMessage('Videos must be an array of IDs'),

  body('videos.*')
    .optional()
    .isMongoId()
    .withMessage('Each video ID must be a valid ID'),
];

export const validateUpdatePlaylist = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Name can be at most 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description can be at most 2000 characters'),

  body('videos')
    .optional()
    .isArray()
    .withMessage('Videos must be an array of IDs'),

  body('videos.*')
    .optional()
    .isMongoId()
    .withMessage('Each video ID must be a valid ID'),
];
