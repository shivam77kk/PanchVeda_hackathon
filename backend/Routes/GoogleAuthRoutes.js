import express from 'express';
import passport from 'passport';
import { googleCallbackHandler, logoutHandler } from '../Controllers/GoogleAuthControllers.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000/login?error=google_auth_failed'
    }),
    googleCallbackHandler
);

router.post('/logout', logoutHandler);

export default router;
