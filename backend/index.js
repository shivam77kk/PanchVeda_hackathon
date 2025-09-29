import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

dotenv.config();

// Read envs (do NOT hard-exit so the server can still start for local testing)
const HAS_GOOGLE_CREDS = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
// Default to local MongoDB for dev if env vars are missing
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
// Ensure JWT secrets exist in dev so tokens work across the app
process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'dev_access_token_secret_change_me';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'dev_refresh_token_secret_change_me';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

import UserRoutes from './Routes/UserRoutes.js';
import DoctorRoutes from './Routes/DoctorRoutes.js';
import DocumentRoutes from './Routes/DocumentRoutes.js';
import GoogleAuthRoutes from './Routes/GoogleAuthRoutes.js';
import SmartWatchRoutes from './Routes/SmartWatchRoutes.js';
import TreatmentPlanRoutes from './Routes/TreatmentPlanRoutes.js';
import AIRoutes from './Routes/AIRoutes.js';
import ReminderRoutes from './Routes/ReminderRoutes.js';
import NewsRoutes from './Routes/NewsRoutes.js';
import ChatbotRoutes from './Routes/ChatbotRoutes.js';
import AppointmentRoutes from './Routes/AppointmentRoutes.js';
import PatientRecordRoutes from './Routes/PatientRecordRoutes.js';
import GuidelinesRoutes from './Routes/GuidelinesRoutes.js';
import ConsentRoutes from './Routes/ConsentRoutes.js';
import PrepRoutes from './Routes/PrepRoutes.js';
import FeedbackRoutes from './Routes/FeedbackRoutes.js';
import SettingsRoutes from './Routes/SettingsRoutes.js';
import MedicationRoutes from './Routes/MedicationRoutes.js';
import DoctorDashboardRoutes from './Routes/DoctorDashboardRoutes.js';
import { initializeGoogleStrategy } from './Controllers/GoogleAuthController.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Always use the PanchVeda database unless explicitly overridden
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'PanchVeda';

// Try to connect to MongoDB. If it fails, keep the server running for OAuth redirect.
mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME })
    .then(async () => {
        console.log('✅ MongoDB connected successfully.');
        console.log('📊 Database:', mongoose.connection.name || 'default');
        console.log('🌐 Host:', mongoose.connection.host);
        try {
            const collections = await mongoose.connection.db.listCollections().toArray();
            console.log('📁 Available collections:', collections.map(c => c.name));
        } catch (err) {
            console.warn('⚠️  Could not list collections:', err.message);
        }
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        console.warn('🚫 Proceeding without database connection (local dev).');
    });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(session({
    // Fall back to a dev secret to avoid hard failure in local dev
    secret: process.env.SESSION_SECRET || 'dev_session_secret_change_me',
    resave: false,
    // Ensure session is set before Google redirect so state can be validated
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize Google strategies only when credentials are available
if (HAS_GOOGLE_CREDS) {
    initializeGoogleStrategy();
    console.log('🔐 Google OAuth enabled.');
} else {
    console.warn('⚠️  GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET missing. Google OAuth is disabled.');
}

app.use('/api/users', UserRoutes);
app.use('/api/doctors', DoctorRoutes);
app.use('/api/documents', DocumentRoutes);

// Debug middleware for Google Auth routes
app.use('/api/auth/google', (req, res, next) => {
    console.log(`\n🔍 [Google Auth] ${req.method} ${req.url}`);
    console.log('📡 Headers:', req.headers['user-agent'] || 'Unknown');
    console.log('🔗 Query:', req.query);
    console.log('👤 Session ID:', req.sessionID || 'No session');
    console.log('🕐 Timestamp:', new Date().toISOString());
    if (req.url.includes('/callback')) {
        console.log('🎯 OAUTH CALLBACK DETECTED!');
        console.log('📋 Full URL:', req.originalUrl);
        console.log('🔐 Auth Code Present:', !!req.query.code);
        console.log('❌ Error Present:', !!req.query.error);
        if (req.query.error) {
            console.log('⚠️ OAuth Error:', req.query.error, req.query.error_description);
        }
    }
    next();
});

// If OAuth is enabled, mount real routes; otherwise, provide a graceful fallback
if (HAS_GOOGLE_CREDS) {
    app.use('/api/auth/google', GoogleAuthRoutes);
} else {
    const fallback = express.Router();
    const redirectWithMsg = (res, msgKey, msg) => {
        const m = encodeURIComponent(msg);
        res.redirect(`http://localhost:3000/login?error=${msgKey}&message=${m}`);
    };
    fallback.get(['/patient', '/doctor', '/patient/callback', '/doctor/callback'], (req, res) => {
        redirectWithMsg(res, 'google_oauth_not_configured', 'Google OAuth is not configured on the server.');
    });
    fallback.get('/health', (req, res) => {
        res.json({ status: 'Google OAuth disabled', reason: 'Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET' });
    });
    app.use('/api/auth/google', fallback);
}

app.use('/api/smartwatch', SmartWatchRoutes); 
app.use('/api', TreatmentPlanRoutes);
app.use('/api', AIRoutes);
app.use('/api', ReminderRoutes);
app.use('/api', NewsRoutes);
app.use('/api', ChatbotRoutes);
app.use('/api', AppointmentRoutes);
app.use('/api', PatientRecordRoutes);
app.use('/api', GuidelinesRoutes);
app.use('/api', ConsentRoutes);
app.use('/api', PrepRoutes);
app.use('/api', FeedbackRoutes);
app.use('/api', SettingsRoutes);
app.use('/api', MedicationRoutes);
app.use('/api', DoctorDashboardRoutes);

app.get('/', (req, res) => {
    res.send('AyurSutra API is running!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
