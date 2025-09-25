import express from 'express';
import { authenticateToken } from '../Middlewares/AuthMIddleware.js';
import {
    initiateGoogleFitAuth,
    handleGoogleFitCallback,
    syncAndCleanData,
    getSmartwatchData,
    getLatestVitals
} from '../Controllers/SmartWatchController.js';

const router = express.Router();

router.get('/auth/googlefit', authenticateToken, initiateGoogleFitAuth);

router.get('/auth/googlefit/callback', handleGoogleFitCallback);

router.post('/sync-and-clean', syncAndCleanData);

router.get('/data', authenticateToken, getSmartwatchData);

router.get('/vitals/latest', authenticateToken, getLatestVitals);

export default router;
