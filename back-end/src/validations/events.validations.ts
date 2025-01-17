import { body, param } from 'express-validator';

export const validateCreateEvent = [
  body('title').isString().notEmpty().withMessage('Title is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO 8601 string'),
  body('id').not().exists().withMessage('ID should not be provided'),
];

export const validateEventId = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
];

export const validateUpdateEvent = [
  param('id').isUUID().withMessage('ID must be a valid UUID'),
  body('title').optional().isString(),
  body('date').optional().isISO8601(),
];