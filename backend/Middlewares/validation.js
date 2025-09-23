import { body, validationResult } from 'express-validator';


export const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('role')
        .isIn(['patient', 'doctor'])
        .withMessage('Role must be either patient or doctor'),
    body('age')
        .isInt({ min: 1, max: 150 })
        .withMessage('Age must be between 1 and 150'),
 
    body('gender')
        .if(body('role').equals('patient'))
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('bloodGroup')
        .if(body('role').equals('patient'))
        .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .withMessage('Invalid blood group'),

    body('experience')
        .if(body('role').equals('doctor'))
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be between 0 and 50 years'),
    body('mode')
        .if(body('role').equals('doctor'))
        .isIn(['Online', 'Offline', 'Both'])
        .withMessage('Mode must be Online, Offline, or Both'),
];


export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    body('role')
        .isIn(['patient', 'doctor'])
        .withMessage('Role must be either patient or doctor'),
];


export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};
