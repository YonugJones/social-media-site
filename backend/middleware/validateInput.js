const { body, validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() })
  }
  next()
}

const validateSignup = [
  body('username')
    .notEmpty().withMessage('Username field cannot be blank')
    .isLength({ min: 3, max: 24 }).withMessage('Username must be between 3 and 24 characters long')
    .matches(/^\S+$/).withMessage('Username may not contain spaces'),
  body('email')
    .notEmpty().withMessage('Email field cannot be blank')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 10 }).withMessage('Password must be at least 10 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords must match'),
  handleValidationErrors
]

const validatePost = [
  body('content')
    .notEmpty().withMessage('Post content cannot be empty')
    .isLength({ max: 180 }).withMessage('Post cannot exceed 180 characters'),
  handleValidationErrors
]

const validateComment = [
  body('content')
    .notEmpty().withMessage('Comment content cannot be empty')
    .isLength({ max: 180 }).withMessage('Comment cannot exceed 180 characters'),
  handleValidationErrors
]

const validateEditUser = [
  body('username')
    .notEmpty().withMessage('Username field cannot be blank')
    .isLength({ min: 3, max: 24 }).withMessage('Username must be between 3 and 24 characters long')
    .matches(/^\S+$/).withMessage('Username must not contain spaces'),
  body('email')
    .notEmpty().withMessage('Email field cannot be blank')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('bio')
    .isLength({ max: 180 }).withMessage('Bio cannot exceed 180 characters'),
  handleValidationErrors
]

module.exports = {
  validateSignup,
  validatePost,
  validateComment,
  validateEditUser
}
