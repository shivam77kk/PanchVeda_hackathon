import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  severity: { type: Number, min: 0, max: 10, default: 0 }
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatmentPlan" },
  date: { type: Date, default: () => new Date(), index: true },
  mood: { type: String, default: "" },
  energyLevel: { type: Number, min: 0, max: 10 },
  symptoms: { type: [symptomSchema], default: [] },
  sideEffects: { type: [String], default: [] },
  notes: { type: String, default: "" }
}, { timestamps: true });

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
