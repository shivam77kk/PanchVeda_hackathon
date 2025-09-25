import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import jwt from 'jsonwebtoken';

export const initializeGoogleStrategy = () => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        console.error('Missing Google OAuth credentials');
        throw new Error('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined');
    }

    const PORT = process.env.PORT || 5000;
    const patientCallbackURL = process.env.GOOGLE_REDIRECT_URI_ || `http://localhost:${PORT}/api/auth/google/patient/callback`;
    const doctorCallbackURL = process.env.GOOGLE_DOCTOR_REDIRECT_URI || `http://localhost:${PORT}/api/auth/google/doctor/callback`;
    
    console.log('Initializing Google OAuth with callbacks:', {
        patient: patientCallbackURL,
        doctor: doctorCallbackURL
    });

    const buildStrategy = (role, callbackURL) => new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(`\n=== [Google ${role.toUpperCase()}] OAuth Strategy Callback ===`);
        console.log('Profile received:', {
            id: profile.id,
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            verified: profile.emails?.[0]?.verified
        });
        
        try {
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            if (!email) {
                console.error(`❌ [Google ${role}] No email provided in profile:`, profile);
                return done(new Error('Email not provided by Google'), null);
            }

            console.log(`🔍 Checking for existing user with email: ${email}`);

            // 1) Check existing by googleId in intended collection
            let userDoc = await (role === 'patient' ? User.findOne({ googleId: profile.id }) : Doctor.findOne({ googleId: profile.id }));
            if (userDoc) {
                console.log(`✅ Found existing ${role} with Google ID:`, {
                    id: userDoc._id,
                    email: userDoc.email,
                    googleId: userDoc.googleId
                });
                userDoc.role = role;
                return done(null, userDoc);
            }

            // 2) Check existing by googleId in other collection
            const otherCollectionDoc = await (role === 'patient' ? Doctor.findOne({ googleId: profile.id }) : User.findOne({ googleId: profile.id }));
            if (otherCollectionDoc) {
                const modelName = otherCollectionDoc?.constructor?.modelName;
                otherCollectionDoc.role = modelName === 'Doctor' ? 'doctor' : 'patient';
                console.log(`✅ Found existing ${otherCollectionDoc.role} with Google ID in other collection:`, {
                    id: otherCollectionDoc._id,
                    email: otherCollectionDoc.email
                });
                return done(null, otherCollectionDoc);
            }

            // 3) Check existing by email in intended collection
            userDoc = await (role === 'patient' ? User.findOne({ email }) : Doctor.findOne({ email }));
            if (userDoc) {
                console.log(`🔗 Linking Google ID to existing ${role}:`, userDoc.email);
                userDoc.googleId = profile.id;
                try {
                    await userDoc.save();
                    console.log(`✅ Successfully linked Google ID to existing ${role}`);
                } catch (saveError) {
                    console.error(`❌ Error saving Google ID link:`, saveError);
                    return done(saveError, null);
                }
                userDoc.role = role;
                return done(null, userDoc);
            }

            // 4) Check existing by email in other collection
            const otherEmailDoc = await (role === 'patient' ? Doctor.findOne({ email }) : User.findOne({ email }));
            if (otherEmailDoc) {
                console.log(`🔗 Linking Google ID to existing user in other collection:`, otherEmailDoc.email);
                otherEmailDoc.googleId = profile.id;
                try {
                    await otherEmailDoc.save();
                    console.log(`✅ Successfully linked Google ID to existing user in other collection`);
                } catch (saveError) {
                    console.error(`❌ Error saving Google ID link to other collection:`, saveError);
                    return done(saveError, null);
                }
                const modelName = otherEmailDoc?.constructor?.modelName;
                otherEmailDoc.role = modelName === 'Doctor' ? 'doctor' : 'patient';
                return done(null, otherEmailDoc);
            }

            // 5) Create a new document in intended collection
            console.log(`🆕 Creating new ${role} for Google user:`, email);
            
            if (role === 'doctor') {
                const doctorData = {
                    googleId: profile.id,
                    name: profile.displayName || 'Google User',
                    email: email,
                    age: 30,
                    experience: 0,
                    mode: 'Both',
                    specialization: 'General Practice',
                    refreshToken: ''
                };
                
                console.log('Doctor data to be saved:', doctorData);
                
                try {
                    const newDoctor = new Doctor(doctorData);
                    const savedDoctor = await newDoctor.save();
                    console.log(`✅ New doctor created successfully:`, {
                        id: savedDoctor._id,
                        email: savedDoctor.email,
                        googleId: savedDoctor.googleId,
                        collection: 'doctors'
                    });
                    savedDoctor.role = 'doctor';
                    return done(null, savedDoctor);
                } catch (saveError) {
                    console.error(`❌ Error creating new doctor:`, {
                        error: saveError.message,
                        code: saveError.code,
                        stack: saveError.stack
                    });
                    return done(saveError, null);
                }
            } else {
                const userData = {
                    googleId: profile.id,
                    name: profile.displayName || 'Google User',
                    email: email,
                    age: 25,
                    gender: 'Other',
                    bloodGroup: 'O+',
                    refreshToken: ''
                };
                
                console.log('User data to be saved:', userData);
                
                try {
                    const newUser = new User(userData);
                    const savedUser = await newUser.save();
                    console.log(`✅ New patient created successfully:`, {
                        id: savedUser._id,
                        email: savedUser.email,
                        googleId: savedUser.googleId,
                        collection: 'users'
                    });
                    savedUser.role = 'patient';
                    return done(null, savedUser);
                } catch (saveError) {
                    console.error(`❌ Error creating new patient:`, {
                        error: saveError.message,
                        code: saveError.code,
                        stack: saveError.stack
                    });
                    return done(saveError, null);
                }
            }
            
        } catch (error) {
            console.error(`❌ [Google ${role}] Critical error in Strategy callback:`, {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
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
    console.log('\n=== GOOGLE OAUTH CALLBACK HANDLER ===');
    console.log('📝 Request user data:', {
        exists: !!req.user,
        id: req.user?._id,
        email: req.user?.email,
        role: req.user?.role,
        googleId: req.user?.googleId,
        name: req.user?.name
    });
    
    try {
        if (!req.user) {
            console.error('Authentication failed: No user found in request');
            return res.redirect('http://localhost:3000/login?error=auth_failed&message=' + encodeURIComponent('Authentication failed'));
        }

        // Verify user has required fields
        if (!req.user._id || !req.user.email) {
            console.error('Invalid user data:', req.user);
            return res.redirect('http://localhost:3000/login?error=invalid_user_data');
        }

        const userRole = req.user.role || 'patient';
        console.log('Processing authentication for role:', userRole);

        // Generate JWT tokens
        if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
            console.error('JWT secrets not configured');
            return res.redirect('http://localhost:3000/login?error=server_config_error');
        }

        const accessToken = jwt.sign(
            { id: req.user._id, role: userRole, email: req.user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        
        const refreshToken = jwt.sign(
            { id: req.user._id, role: userRole, email: req.user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Set secure HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Save refresh token to user document
        try {
            req.user.refreshToken = refreshToken;
            const savedUser = await req.user.save();
            console.log('✅ Refresh token saved successfully for user:', req.user.email);
            console.log('💾 Final user document in database:', {
                id: savedUser._id,
                email: savedUser.email,
                googleId: savedUser.googleId,
                name: savedUser.name,
                role: req.user.role,
                collection: savedUser.constructor.modelName === 'Doctor' ? 'doctors' : 'users'
            });
            
            // Double-check database save
            const User = (await import('../models/UserSchema.js')).default;
            const Doctor = (await import('../models/DoctorSchema.js')).default;
            const dbCheck = req.user.role === 'doctor' 
                ? await Doctor.findById(savedUser._id)
                : await User.findById(savedUser._id);
            
            if (dbCheck) {
                console.log('✅ Database verification: User exists in', req.user.role === 'doctor' ? 'doctors' : 'users', 'collection');
            } else {
                console.error('❌ Database verification failed: User not found in database!');
            }
            
        } catch (saveError) {
            console.error('❌ Error saving refresh token:', saveError.message);
            console.error('❌ Save error details:', saveError);
            // Continue with authentication even if refresh token save fails
        }

        // Determine redirect URL based on role
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const dashboardUrl = userRole === 'doctor' 
            ? `${frontendUrl}/dashboard?view=doctor&token=${accessToken}&user=${encodeURIComponent(JSON.stringify({ id: req.user._id, email: req.user.email, role: userRole }))}`
            : `${frontendUrl}/dashboard?view=patient&token=${accessToken}&user=${encodeURIComponent(JSON.stringify({ id: req.user._id, email: req.user.email, role: userRole }))}`;
            
        console.log('Successfully authenticated user. Redirecting to:', dashboardUrl.split('&token=')[0] + '&token=***');
        
        // Add success parameters for frontend
        const successUrl = `${dashboardUrl}&auth_success=true&timestamp=${Date.now()}`;
        res.redirect(successUrl);
        
    } catch (error) {
        console.error('Critical error in googleCallbackHandler:', {
            message: error.message,
            stack: error.stack,
            user: req.user?.email
        });
        
        const errorMessage = error.message || 'Unknown authentication error';
        const encodedError = encodeURIComponent(errorMessage);
        res.redirect(`http://localhost:3000/login?error=google_auth_error&message=${encodedError}&timestamp=${Date.now()}`);
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
