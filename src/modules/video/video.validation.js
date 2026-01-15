import { body } from 'express-validator';

export const validateCreateVideo = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('videoFile')
    .trim()
    .notEmpty()
    .withMessage('Video file URL is required')
    .isURL()
    .withMessage('Video file must be a valid URL'),

  body('thumbnail')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description can be at most 2000 characters'),

  body('duration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Duration must be a positive number'),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be true or false'),
];

export const validateUpdateVideo = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('videoFile')
    .optional()
    .trim()
    .isURL()
    .withMessage('Video file must be a valid URL'),

  body('thumbnail')
    .optional()
    .trim()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description can be at most 2000 characters'),

  body('duration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Duration must be a positive number'),

  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be true or false'),
];
