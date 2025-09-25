import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatmentPlan", required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true },
  dosage: { type: String, default: "" },
  frequency: { type: String, default: "" },
  durationDays: { type: Number, default: 0 },
  startDate: { type: Date, default: () => new Date() },
  status: { type: String, enum: ["active","completed","stopped"], default: "active", index: true }
}, { timestamps: true });

const Medication = mongoose.model("Medication", medicationSchema);
export default Medication;
