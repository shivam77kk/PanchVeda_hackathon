import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import { googleCallbackHandler, logoutHandler } from '../Controllers/GoogleAuthController.js';

const router = express.Router();

// Add error handling middleware
const handleAuthError = (error, req, res, next) => {
    console.error('OAuth authentication error:', error);
    const errorMessage = encodeURIComponent(error.message || 'Authentication failed');
    res.redirect(`http://localhost:3000/login?error=oauth_error&message=${errorMessage}`);
};

// Patient Google OAuth initiation
router.get('/patient', (req, res, next) => {
    console.log('Initiating Google OAuth for patient');
    passport.authenticate('google-patient', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
});

// Patient Google OAuth callback
router.get('/patient/callback', 
    (req, res, next) => {
        console.log('Patient callback route hit:', req.url);
        console.log('Query params:', req.query);
        next();
    },
    passport.authenticate('google-patient', {
        failureRedirect: 'http://localhost:3000/login?error=google_patient_auth_failed&timestamp=' + Date.now()
    }),
    googleCallbackHandler
);

// Doctor Google OAuth initiation
router.get('/doctor', (req, res, next) => {
    console.log('Initiating Google OAuth for doctor');
    passport.authenticate('google-doctor', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })(req, res, next);
});

// Doctor Google OAuth callback
router.get('/doctor/callback',
    (req, res, next) => {
        console.log('Doctor callback route hit:', req.url);
        console.log('Query params:', req.query);
        next();
    },
    passport.authenticate('google-doctor', {
        failureRedirect: 'http://localhost:3000/login?error=google_doctor_auth_failed&timestamp=' + Date.now()
    }),
    googleCallbackHandler
);

// Logout route
router.post('/logout', logoutHandler);

// Health check route
router.get('/health', (req, res) => {
    res.json({
        status: 'Google Auth routes are working',
        timestamp: new Date().toISOString(),
        oauth_configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        mongodb_connected: mongoose.connection.readyState === 1,
        database_name: mongoose.connection.name
    });
});

// Test MongoDB connection
router.get('/test-db', async (req, res) => {
    try {
        const User = (await import('../models/UserSchema.js')).default;
        const Doctor = (await import('../models/DoctorSchema.js')).default;
        
        const userCount = await User.countDocuments();
        const doctorCount = await Doctor.countDocuments();
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        res.json({
            status: 'Database connection successful',
            database: mongoose.connection.name,
            collections: collections.map(c => c.name),
            counts: {
                users: userCount,
                doctors: doctorCount
            },
            readyState: mongoose.connection.readyState,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'Database connection failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Real-time database monitoring for OAuth testing
router.get('/monitor-db', async (req, res) => {
    try {
        const User = (await import('../models/UserSchema.js')).default;
        const Doctor = (await import('../models/DoctorSchema.js')).default;
        
        const users = await User.find({}).select('name email googleId createdAt').sort({ createdAt: -1 }).limit(5);
        const doctors = await Doctor.find({}).select('name email googleId createdAt').sort({ createdAt: -1 }).limit(5);
        
        res.json({
            status: 'Database monitoring active',
            database: mongoose.connection.name,
            timestamp: new Date().toISOString(),
            counts: {
                users: await User.countDocuments(),
                doctors: await Doctor.countDocuments()
            },
            recentUsers: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                googleId: u.googleId,
                createdAt: u.createdAt
            })),
            recentDoctors: doctors.map(d => ({
                id: d._id,
                name: d.name,
                email: d.email,
                googleId: d.googleId,
                createdAt: d.createdAt
            }))
        });
    } catch (error) {
        res.status(500).json({
            status: 'Database monitoring failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Test user creation endpoint
router.post('/test-create-user', async (req, res) => {
    try {
        const User = (await import('../models/UserSchema.js')).default;
        
        const testUser = new User({
            googleId: `test_${Date.now()}`,
            name: 'Test OAuth User',
            email: `test${Date.now()}@example.com`,
            age: 25,
            gender: 'Other',
            bloodGroup: 'O+',
            refreshToken: ''
        });
        
        const savedUser = await testUser.save();
        console.log('🧪 Test user created via API:', savedUser.email);
        
        res.json({
            status: 'Test user created successfully',
            user: {
                id: savedUser._id,
                email: savedUser.email,
                googleId: savedUser.googleId,
                name: savedUser.name
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Test user creation failed:', error);
        res.status(500).json({
            status: 'Test user creation failed',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
router.use(handleAuthError);

export default router;
