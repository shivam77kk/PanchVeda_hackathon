import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  relation: { type: String, trim: true },
  phone: { type: String, trim: true }
}, { _id: false });

const lifestyleSchema = new mongoose.Schema({
  dietType: { type: String, enum: ["Vegan","Vegetarian","Eggetarian","Non-Vegetarian","Satvik","Other",""], default: "" },
  smoking: { type: String, enum: ["Never","Occasional","Regular","Quit",""], default: "" },
  alcohol: { type: String, enum: ["Never","Occasional","Regular","Quit",""], default: "" },
  sleepHours: { type: Number, min: 0, max: 24 },
  activityLevel: { type: String, enum: ["Low","Moderate","High","Athlete",""], default: "" },
  occupation: { type: String, trim: true, default: "" },
  stressLevel: { type: String, enum: ["Low","Medium","High",""], default: "" },
  hydration: { type: String, enum: ["Low","Adequate","High",""], default: "" }
}, { _id: false });

const medicalHistorySchema = new mongoose.Schema({
  conditions: { type: [String], default: [] },
  surgeries: { type: [String], default: [] },
  medications: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  contraindications: { type: [String], default: [] },
  familyHistory: { type: [String], default: [] },
  diagnoses: { type: [String], default: [] }
}, { _id: false });

const pastTherapySchema = new mongoose.Schema({
  date: { type: Date, default: () => new Date() },
  therapyName: { type: String, required: true },
  notes: { type: String, default: "" },
  outcome: { type: String, default: "" },
  center: { type: String, default: "" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }
}, { _id: false });

const vitalsSchema = new mongoose.Schema({
  heartRate: Number,
  bloodPressure: { systolic: Number, diastolic: Number },
  oxygenSaturation: Number,
  weight: Number,
  bmi: Number
}, { _id: false });

const patientRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  lifestyle: { type: lifestyleSchema, default: {} },
  medicalHistory: { type: medicalHistorySchema, default: {} },
  vitalsBaseline: { type: vitalsSchema, default: {} },
  emergencyContacts: { type: [emergencyContactSchema], default: [] },
  pastTherapies: { type: [pastTherapySchema], default: [] },
  consents: {
    dataProcessing: { type: Boolean, default: true },
    shareWithDoctor: { type: Boolean, default: true }
  },
  lastUpdatedBy: {
    id: { type: mongoose.Schema.Types.ObjectId },
    role: { type: String, enum: ["patient","doctor","system"], default: "system" },
    at: { type: Date, default: () => new Date() }
  }
}, { timestamps: true });

const PatientRecord = mongoose.model("PatientRecord", patientRecordSchema);
export default PatientRecord;
