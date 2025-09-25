import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: true, index: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  date: { type: Date, required: true, index: true },
  treatmentType: { type: String, default: "General Consultation" },
  summary: { type: String, default: "" },
  followUpRecommended: { type: Boolean, default: false },
  nextVisitAt: { type: Date }
}, { timestamps: true });

const Visit = mongoose.model("Visit", visitSchema);
export default Visit;
