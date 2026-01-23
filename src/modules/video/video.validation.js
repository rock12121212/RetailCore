import { body } from 'express-validator';

export const validateCreateVideo = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('videoFile')
    .optional(),

  body('thumbnail')
    .optional(),

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
    .optional(),

  body('thumbnail')
    .optional(),

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
