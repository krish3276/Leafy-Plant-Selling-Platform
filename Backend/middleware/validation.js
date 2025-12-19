import { body } from 'express-validator';

export const signupValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail() // Checks valid email format
    .withMessage('Please provide a valid email')
    .normalizeEmail(), // Converts to lowercase, removes dots from Gmail, etc.

  // Password Validation
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/) // Regex for strong password
    .withMessage('Password must contain uppercase, lowercase, and number'),

  // Confirm Password Validation
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your password')
    .custom((value, { req }) => {
      // Custom validation: compare with password field
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * 🔐 LOGIN VALIDATION RULES
 */
export const loginValidation = [
  // Email Validation
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  // Password Validation (just check it exists)
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * 👤 UPDATE PROFILE VALIDATION RULES
 */
export const updateProfileValidation = [
  // First Name (optional)
  body('firstName')
    .optional() // Field is not required
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters'),

  // Last Name (optional)
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters'),

  // Email (optional)
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

/**
 * 🎓 LEARNING NOTES:
 * 
 * 1. VALIDATION CHAIN:
 *    - Each body('field') creates a validation chain
 *    - Methods are chained: .trim().notEmpty().isEmail()
 *    - Each method adds a rule
 *    - All rules must pass for validation to succeed
 * 
 * 2. COMMON VALIDATION METHODS:
 *    - notEmpty(): field must not be empty
 *    - isEmail(): checks email format
 *    - isLength({min, max}): checks string length
 *    - matches(regex): checks against regular expression
 *    - optional(): field is not required
 *    - custom(): custom validation function
 * 
 * 3. SANITIZATION METHODS:
 *    - trim(): removes whitespace
 *    - normalizeEmail(): standardizes email format
 *    - escape(): prevents XSS attacks
 *    - These clean/modify the input before validation
 * 
 * 4. REGULAR EXPRESSIONS (REGEX):
 *    /^[a-zA-Z\s]+$/
 *    ↓  ↓         ↓
 *    start  chars   end
 *    - ^ = start of string
 *    - $ = end of string
 *    - [a-zA-Z] = any letter (lowercase or uppercase)
 *    - \s = whitespace
 *    - + = one or more
 * 
 *    Password regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
 *    - (?=.*[a-z]) = must contain lowercase
 *    - (?=.*[A-Z]) = must contain uppercase
 *    - (?=.*\d) = must contain digit
 * 
 * 5. USING VALIDATION IN ROUTES:
 *    router.post('/signup', signupValidation, signup)
 *                          ↑                  ↑
 *                    validate first    then controller
 * 
 *    If validation fails, controller never runs
 *    Errors are collected in validationResult(req)
 * 
 * 6. SECURITY BENEFITS:
 *    - Prevents SQL injection
 *    - Prevents XSS (Cross-Site Scripting)
 *    - Ensures data integrity
 *    - Provides user-friendly error messages
 * 
 * REAL-WORLD ANALOGY:
 * - Validation = Airport security checkpoint
 * - Rules = "No liquids over 100ml", "Remove shoes", etc.
 * - If you don't pass, you can't board (reach controller)
 * - Sanitization = "Empty your pockets" (clean the input)
 */
