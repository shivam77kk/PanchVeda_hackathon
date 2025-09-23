import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';

export const initializeGoogleStrategy = () => {
    // console.log('Initializing Google Strategy...');
    // console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    // console.log('Google Client Secret:', process.env.GOOGLE_CLIENT_SECRET);

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined');
    }

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5000/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('Google Strategy Callback - Profile:', profile.id);
        try {
            const email = profile.emails[0].value;
            console.log('OAuth callback - Email:', email);
            
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                user.role = 'patient';
                console.log('Existing patient found with Google ID:', user.email);
                return done(null, user);
            }
            
            user = await Doctor.findOne({ googleId: profile.id });
            if (user) {
                user.role = 'doctor';
                console.log('Existing doctor found with Google ID:', user.email);
                return done(null, user);
            }

            user = await User.findOne({ email });
            if (user) {
                user.googleId = profile.id;
                await user.save();
                user.role = 'patient';
                console.log('Linked Google ID to existing patient:', user.email);
                return done(null, user);
            }
            
            user = await Doctor.findOne({ email });
            if (user) {
                user.googleId = profile.id;
                await user.save();
                user.role = 'doctor';
                console.log('Linked Google ID to existing doctor:', user.email);
                return done(null, user);
            }
            
            console.log('Creating new patient for Google user:', email); // might to create for same for doctor too
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: email,
                age: 25, 
                gender: 'Other',
                bloodGroup: 'O+',
                refreshToken: ''
            });
            await user.save();
            user.role = 'patient';
            console.log('New patient created:', user._id);
            
            done(null, user);
        } catch (error) {
            console.error('Error in Google Strategy callback:', error.message);
            done(error, null);
        }
    }));
};

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user:', id);
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.error('Error in deserializeUser:', error.message);
        done(error, null);
    }
});

export const googleCallbackHandler = async (req, res) => {
    console.log('Google callback handler - User:', req.user?.email, 'Role:', req.user?.role);
    try {
        if (!req.user) {
            console.error('No user found in request');
            return res.redirect('http://localhost:3000/login?error=auth_failed');
        }

        const userRole = req.user.role || 'patient';
        const accessToken = jwt.sign(
            { id: req.user._id, role: userRole },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { id: req.user._id, role: userRole },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        req.user.refreshToken = refreshToken;
        await req.user.save();
        console.log('Refresh token saved for user:', req.user.email);

        const dashboardUrl = userRole === 'doctor' 
            ? `http://localhost:3000/dashboard?view=doctor&token=${accessToken}`
            : `http://localhost:3000/dashboard?view=patient&token=${accessToken}`;
            
        console.log('Redirecting to:', dashboardUrl);
        res.redirect(dashboardUrl);
    } catch (error) {
        console.error('Error in googleCallbackHandler:', error.message);
        res.redirect(`http://localhost:3000/login?error=google_auth_error&message=${encodeURIComponent(error.message)}`);
    }
};


export const logoutHandler = async (req, res) => {
    try {

        if (!req.user) {
            return res.status(401).json({ message: 'No user is logged in' });
        }

        console.log('Logging out user:', req.user.email);


        req.user.refreshToken = '';
        await req.user.save();
        console.log('Refresh token cleared for user:', req.user.email);


        req.logout((err) => {
            if (err) {
                console.error('Error during logout:', err.message);
                return res.status(500).json({ message: 'Error during logout', error: err.message });
            }


            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err.message);
                    return res.status(500).json({ message: 'Error destroying session', error: err.message });
                }

                res.clearCookie('jwt', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict'
                });

                console.log('User logged out successfully');


                res.status(200).json({ message: 'Logged out successfully' });
            });
        });
    } catch (error) {
        console.error('Error in logoutHandler:', error.message);
        res.status(500).json({ message: 'Error during logout', error: error.message });
    }
};
