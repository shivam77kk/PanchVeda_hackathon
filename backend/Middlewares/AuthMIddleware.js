import jwt from 'jsonwebtoken';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js'; 

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: "Authentication token missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = user;
        next();
    });
};

export const isPatient = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'patient') {
            return res.status(403).json({ message: "Access denied. Patient access required." });
        }

        const user = await User.findById(req.user.id);
        if (user) {
            req.currentUser = user;
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Patient not found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isDoctor = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'doctor') {
            return res.status(403).json({ message: "Access denied. Doctor access required." });
        }

        const doctor = await Doctor.findById(req.user.id);
        if (doctor) {
            req.currentUser = doctor;
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Doctor not found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isAuthenticated = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id || !req.user.role) {
            return res.status(403).json({ message: "Access denied. Authentication required." });
        }

        let currentUser;
        if (req.user.role === 'doctor') {
            currentUser = await Doctor.findById(req.user.id);
        } else {
            currentUser = await User.findById(req.user.id);
        }

        if (currentUser) {
            req.currentUser = currentUser;
            next();
        } else {
            return res.status(403).json({ message: "Access denied. User not found." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const isUser = isPatient;
