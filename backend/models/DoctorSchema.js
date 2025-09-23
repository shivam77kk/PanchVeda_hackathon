import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false, // Allow Google users without password
        minlength: 6,
        select: false
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age is invalid']
    },
    experience: {
        type: Number,
        required: true,
        default: 0
    },
    mode: {
        type: String,
        enum: ["Online", "Offline", "Both"],
        required: true,
        default: "Both"
    },
    specialization: {
        type: String,
        default: "General Practice"
    },
    profileImage: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
        default: ''
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
