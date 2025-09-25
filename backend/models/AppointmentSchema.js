import mongoose from "mongoose";

const appointmentEventSchema = new mongoose.Schema({
  type: { type: String, enum: [
    "created","accepted","rescheduled_by_patient","rescheduled_by_doctor",
    "cancelled_by_patient","cancelled_by_doctor","completed","rejected"
  ], required: true },
  at: { type: Date, default: () => new Date() },
  by: { type: String, enum: ["patient","doctor","system"], default: "system" },
  notes: { type: String, default: "" }
}, { _id: false });

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, default: 30 },
  status: { type: String, enum: [
    "pending","accepted","rescheduled","cancelled_by_patient","cancelled_by_doctor","completed","rejected"
  ], default: "pending", index: true },
  concern: { type: String, default: "" },
  treatmentType: { type: String, default: "General Consultation" },
  mode: { type: String, enum: ["Online","Offline","Both"], default: "Both" },
  location: { type: String, default: "" },
  language: { type: [String], default: [] },
  fee: { type: Number, default: 0 },
  events: { type: [appointmentEventSchema], default: [] }
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
