import express from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../Controllers/DocumentController.js';
import { authenticateToken, isPatient } from '../Middlewares/AuthMIddleware.js';
import { upload } from '../Middlewares/multer.config.js';

const router = express.Router();

router.post('/upload', authenticateToken, isPatient, upload.single('document'), uploadDocument);

router.get('/', authenticateToken, isPatient, getDocuments);

router.delete('/:id', authenticateToken, isPatient, deleteDocument);

export default router;
