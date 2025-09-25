import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';

export const initializeGoogleStrategy = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined');
    }

    const PORT = process.env.PORT || 5000;
    const patientCallbackURL = process.env.GOOGLE_REDIRECT_URI_ || `http://localhost:${PORT}/api/auth/google/patient/callback`;
    const doctorCallbackURL = process.env.GOOGLE_DOCTOR_REDIRECT_URI || `http://localhost:${PORT}/api/auth/google/doctor/callback`;

    const buildStrategy = (role, callbackURL) => new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(`[Google ${role}] Strategy Callback - Profile:`, profile.id);
        try {
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            if (!email) {
                return done(new Error('Email not provided by Google'), null);
            }

            // 1) Check existing by googleId
            let userDoc = await (role === 'patient' ? User.findOne({ googleId: profile.id }) : Doctor.findOne({ googleId: profile.id }));
            if (userDoc) {
                userDoc.role = role;
                console.log(`Existing ${role} found with Google ID:`, userDoc.email);
                return done(null, userDoc);
            }

            // 2) Check existing by googleId in the other collection (in case role changed)
            userDoc = await (role === 'patient' ? Doctor.findOne({ googleId: profile.id }) : User.findOne({ googleId: profile.id }));
            if (userDoc) {
                userDoc.role = userDoc instanceof Doctor ? 'doctor' : 'patient';
                console.log(`Existing ${userDoc.role} found with Google ID in other collection:`, userDoc.email);
                return done(null, userDoc);
            }

            // 3) Check existing by email in intended collection
            userDoc = await (role === 'patient' ? User.findOne({ email }) : Doctor.findOne({ email }));
            if (userDoc) {
                userDoc.googleId = profile.id;
                await userDoc.save();
                userDoc.role = role;
                console.log(`Linked Google ID to existing ${role}:`, userDoc.email);
                return done(null, userDoc);
            }

            // 4) Check existing by email in other collection
            const otherDoc = await (role === 'patient' ? Doctor.findOne({ email }) : User.findOne({ email }));
            if (otherDoc) {
                otherDoc.googleId = profile.id;
                await otherDoc.save();
                otherDoc.role = otherDoc instanceof Doctor ? 'doctor' : 'patient';
                console.log(`Linked Google ID to existing ${otherDoc.role} (other collection):`, otherDoc.email);
                return done(null, otherDoc);
            }

            // 5) Create a new doc in intended collection
            if (role === 'doctor') {
                console.log('Creating new doctor for Google user:', email);
                const newDoctor = new Doctor({
                    googleId: profile.id,
                    name: profile.displayName,
                    email,
                    age: 30,
                    experience: 0,
                    mode: 'Both',
                    specialization: 'General Practice',
                    refreshToken: ''
                });
                await newDoctor.save();
                newDoctor.role = 'doctor';
                console.log('New doctor created:', newDoctor._id);
                return done(null, newDoctor);
            } else {
                console.log('Creating new patient for Google user:', email);
                const newUser = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email,
                    age: 25,
                    gender: 'Other',
                    bloodGroup: 'O+',
                    refreshToken: ''
                });
                await newUser.save();
                newUser.role = 'patient';
                console.log('New patient created:', newUser._id);
                return done(null, newUser);
            }
        } catch (error) {
            console.error(`[Google ${role}] Error in Strategy callback:`, error.message);
            return done(error, null);
        }
    });

    // Register two named strategies
    passport.use('google-patient', buildStrategy('patient', patientCallbackURL));
    passport.use('google-doctor', buildStrategy('doctor', doctorCallbackURL));
};

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user:', id);
    try {
        let user = await User.findById(id);
        if (!user) {
            user = await Doctor.findById(id);
        }
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
