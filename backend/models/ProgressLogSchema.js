import mongoose from "mongoose";

const progressLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatmentPlan", required: true, index: true },
  dayNumber: { type: Number, required: true },
  stage: { type: String, enum: ["Purvakarma", "Pradhankarma", "Paschatkarma", "Unknown"], default: "Unknown" },
  completedTherapies: { type: [String], default: [] },
  mood: { type: String, default: "" },
  notes: { type: String, default: "" },
  vitalsSnapshot: {
    heartRate: Number,
    bloodPressure: { systolic: Number, diastolic: Number },
    oxygenSaturation: Number,
    respiratoryRate: Number
  }
}, { timestamps: true });

const ProgressLog = mongoose.model("ProgressLog", progressLogSchema);
export default ProgressLog;
