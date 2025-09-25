import mongoose from "mongoose";

const therapySchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructions: { type: String, default: "" },
  phase: { type: String, enum: ["Purvakarma", "Pradhankarma", "Paschatkarma", "Other", ""], default: "" },
  time: { type: String, default: "" } // optional HH:mm for daily schedule
}, { _id: false });

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: Date },
  therapies: { type: [therapySchema], default: [] },
  completed: { type: Boolean, default: false },
  notes: { type: String, default: "" }
}, { _id: false });

const treatmentPlanSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
  title: { type: String, required: true },
  startDate: { type: Date, default: () => new Date() },
  days: { type: [daySchema], default: [] },
  status: { type: String, enum: ["active", "completed", "cancelled"], default: "active" }
}, { timestamps: true });

const TreatmentPlan = mongoose.model("TreatmentPlan", treatmentPlanSchema);
export default TreatmentPlan;
