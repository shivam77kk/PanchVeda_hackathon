import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatmentPlan", index: true },
  dayNumber: { type: Number },
  category: { type: String, enum: ["pre","post","medicine","diet","exercise","general"], default: "general", index: true },
  message: { type: String, required: true },
  scheduledAt: { type: Date, required: true, index: true },
  status: { type: String, enum: ["pending", "sent", "cancelled"], default: "pending", index: true },
  sentAt: { type: Date }
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
