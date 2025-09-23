import express from 'express';
import {
    registerUser,
    loginUser,
    changePassword,
    uploadProfileImage,
    refreshAccessToken,
    getUserProfile,
    logoutUser
} from '../Controllers/UserController.js';
import { authenticateToken } from '../Middlewares/AuthMIddleware.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);

router.post('/logout', authenticateToken, logoutUser);
router.get('/profile', authenticateToken, getUserProfile);
router.put('/change-password', authenticateToken, changePassword);
router.post('/upload-image', authenticateToken, upload.single('profileImage'), uploadProfileImage);

export default router;
