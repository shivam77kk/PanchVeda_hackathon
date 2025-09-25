import mongoose from "mongoose";

const consentTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  treatmentName: { type: String, required: true, index: true },
  content: { type: String, required: true },
  version: { type: String, default: "1.0" },
  language: { type: String, default: "en" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
}, { timestamps: true });

const consentSignatureSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "ConsentTemplate", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  signedByName: { type: String, required: true },
  signatureHash: { type: String, required: true },
  signedAt: { type: Date, default: () => new Date() }
}, { timestamps: true });

export const ConsentTemplate = mongoose.model("ConsentTemplate", consentTemplateSchema);
export const ConsentSignature = mongoose.model("ConsentSignature", consentSignatureSchema);
