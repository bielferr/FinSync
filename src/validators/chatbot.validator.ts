import { body } from 'express-validator';

export const messageValidator = [
  body('message')
    .isString()
    .notEmpty()
    .withMessage('Message must be a non-empty string')
    .isLength({ max: 500 })
    .withMessage('Message must not exceed 500 characters')
];

export const trainValidator = [
  body('phrases')
    .isArray()
    .withMessage('Phrases must be an array')
    .notEmpty()
    .withMessage('Phrases array must not be empty'),
  
  body('categories')
    .isArray()
    .withMessage('Categories must be an array')
    .notEmpty()
    .withMessage('Categories array must not be empty'),
  
  body('phrases.*')
    .isString()
    .withMessage('All phrases must be strings'),
  
  body('categories.*')
    .isString()
    .withMessage('All categories must be strings')
];