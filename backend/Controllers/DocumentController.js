import Document from '../models/DocumentSchema.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload a patient document
export const uploadDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description = '' } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No document file provided' });
        }

        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'healthcare_patient_documents',
        });

        const newDoc = new Document({
            userId,
            title,
            description,
            fileUrl: result.secure_url,
            publicId: result.public_id,
        });

        await newDoc.save();

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: newDoc,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading document', error: error.message });
    }
};

// Get patient documents
export const getDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const docs = await Document.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Documents retrieved successfully', documents: docs });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving documents', error: error.message });
    }
};

// Delete a patient document
export const deleteDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const doc = await Document.findOne({ _id: id, userId });
        if (!doc) {
            return res.status(404).json({ message: 'Document not found or does not belong to this user.' });
        }

        await cloudinary.uploader.destroy(doc.publicId);
        await Document.findByIdAndDelete(id);

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting document', error: error.message });
    }
};
