import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';

dotenv.config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not defined in .env file');
    process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
if (!MONGO_URI) {
    console.error('Error: MONGO_URI/MONGO_URL is not defined in .env file');
    process.exit(1);
}

if (!process.env.SESSION_SECRET) {
    console.error('Error: SESSION_SECRET is not defined in .env file');
    process.exit(1);
}

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

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully.');
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    });

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
    }
}));
app.use(passport.initialize());
app.use(passport.session());


initializeGoogleStrategy();

app.use('/api/users', UserRoutes);
app.use('/api/doctors', DoctorRoutes);
app.use('/api/documents', DocumentRoutes);
app.use('/api/auth/google', GoogleAuthRoutes);
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
