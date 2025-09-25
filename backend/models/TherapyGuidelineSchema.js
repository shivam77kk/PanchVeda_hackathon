import mongoose from "mongoose";

const guidelineSchema = new mongoose.Schema({
  therapyName: { type: String, required: true, index: true },
  language: { type: String, default: "en" },
  preInstructions: { type: [String], default: [] },
  postInstructions: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
}, { timestamps: true });

const TherapyGuideline = mongoose.model("TherapyGuideline", guidelineSchema);
export default TherapyGuideline;
