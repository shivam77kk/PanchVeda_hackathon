import express from 'express';
import passport from 'passport';
import { googleCallbackHandler, logoutHandler } from '../Controllers/GoogleAuthController.js';

const router = express.Router();

// Patient Google OAuth
router.get('/patient', passport.authenticate('google-patient', { scope: ['profile', 'email'] }));
router.get('/patient/callback',
    passport.authenticate('google-patient', {
        failureRedirect: 'http://localhost:3000/login?error=google_auth_failed'
    }),
    googleCallbackHandler
);

// Doctor Google OAuth
router.get('/doctor', passport.authenticate('google-doctor', { scope: ['profile', 'email'] }));
router.get('/doctor/callback',
    passport.authenticate('google-doctor', {
        failureRedirect: 'http://localhost:3000/login?error=google_auth_failed'
    }),
    googleCallbackHandler
);

router.post('/logout', logoutHandler);

export default router;
