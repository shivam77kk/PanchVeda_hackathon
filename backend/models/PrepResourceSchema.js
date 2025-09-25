import mongoose from "mongoose";

const prepResourceSchema = new mongoose.Schema({
  therapyName: { type: String, required: true, index: true },
  language: { type: String, default: "en" },
  videoUrl: { type: String, default: "" },
  checklist: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
}, { timestamps: true });

const PrepResource = mongoose.model("PrepResource", prepResourceSchema);
export default PrepResource;
