import express from 'express';
import {
    registerDoctor,
    loginDoctor,
    uploadDoctorDocument,
    getAllDoctors,
    getDoctorProfile,
    getDoctorDocuments,
    viewDoctorDocument,
    deleteDoctorDocument,
    getPatientHistory,
    logoutDoctor
} from '../Controllers/DoctorController.js';
import { authenticateToken, isDoctor } from '../Middlewares/AuthMIddleware.js';
import { upload } from '../Middlewares/multer.config.js';
import { validateRegistration, validateLogin, handleValidationErrors } from '../Middlewares/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, registerDoctor);
router.post('/login', validateLogin, handleValidationErrors, loginDoctor);

router.get('/', getAllDoctors);

router.use(authenticateToken, isDoctor);

router.get('/profile/:id', getDoctorProfile);

router.post('/documents/upload', upload.single('document'), uploadDoctorDocument);
router.get('/documents', getDoctorDocuments);
router.get('/documents/view/:documentId', viewDoctorDocument);
router.delete('/documents/delete/:documentId', deleteDoctorDocument);

router.get('/patients/:id/history', getPatientHistory);

router.post('/logout', logoutDoctor);

export default router;
