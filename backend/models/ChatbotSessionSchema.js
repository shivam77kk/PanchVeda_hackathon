import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() }
}, { _id: false });

const chatbotSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "TreatmentPlan" },
  detectedStage: { type: String, enum: ["Purvakarma", "Pradhankarma", "Paschatkarma", "Unknown"], default: "Unknown" },
  messages: { type: [chatMessageSchema], default: [] },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

const ChatbotSession = mongoose.model("ChatbotSession", chatbotSessionSchema);
export default ChatbotSession;
