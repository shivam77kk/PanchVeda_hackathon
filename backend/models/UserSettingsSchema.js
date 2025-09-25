import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, index: true, ref: "User" },
  language: { type: String, default: "en" },
  voiceEnabled: { type: Boolean, default: false },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true },
    prePostReminders: { type: Boolean, default: true }
  }
}, { timestamps: true });

const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
export default UserSettings;
