import TreatmentPlan from "../models/TreatmentPlanSchema.js";
import ProgressLog from "../models/ProgressLogSchema.js";
import Reminder from "../models/ReminderSchema.js";
import SmartwatchData from "../models/SmartWatchSchema.js";

// Helper to generate default 7-day Panchakarma plan if none provided
const defaultTherapies = [
  [{ name: "Oil therapy + steam", instructions: "Abhyanga + Swedana", phase: "Purvakarma", time: "09:00" }],
  [{ name: "Diet + Rest", instructions: "Light, warm meals", phase: "Purvakarma", time: "12:00" }],
  [{ name: "Vamana", instructions: "Under supervision", phase: "Pradhankarma", time: "10:00" }],
  [{ name: "Rest", instructions: "Hydrate well", phase: "Pradhankarma", time: "14:00" }],
  [{ name: "Basti", instructions: "As prescribed", phase: "Pradhankarma", time: "11:00" }],
  [{ name: "Diet adjustments", instructions: "As per dosha", phase: "Paschatkarma", time: "16:00" }],
  [{ name: "Review", instructions: "Doctor follow-up", phase: "Paschatkarma", time: "18:00" }]
];

const buildDays = (startDate, daysInput) => {
  const days = [];
  const therapiesByDay = daysInput?.length ? daysInput : defaultTherapies;
  for (let i = 0; i < therapiesByDay.length; i++) {
    const dayNumber = i + 1;
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push({ dayNumber, date, therapies: therapiesByDay[i] });
  }
  return days;
};

export const createPlan = async (req, res) => {
  try {
    const doctorId = req.user?.id;
    if (!doctorId || req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctor access required" });
    }

    const { patientId, title, startDate, days: daysInput } = req.body;
    if (!patientId || !title) {
      return res.status(400).json({ message: "patientId and title are required" });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const days = buildDays(start, daysInput);

    const plan = new TreatmentPlan({ patientId, doctorId, title, startDate: start, days });
    await plan.save();

    // Create reminders at 10:00 AM for each day
    const reminders = days.map(d => ({
      patientId,
      planId: plan._id,
      dayNumber: d.dayNumber,
      message: `Today's therapy: ${d.therapies.map(t => t.name).join(", ")}`,
      scheduledAt: new Date(new Date(d.date).setHours(10, 0, 0, 0))
    }));
    await Reminder.insertMany(reminders);

    res.status(201).json({ message: "Plan created", plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlansForPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const plans = await TreatmentPlan.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json({ plans });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await TreatmentPlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    if (req.user.role !== "doctor") return res.status(403).json({ message: "Doctor access required" });
    const { id } = req.params;
    const updates = req.body;
    const plan = await TreatmentPlan.findByIdAndUpdate(id, updates, { new: true });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.status(200).json({ message: "Plan updated", plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeDay = async (req, res) => {
  try {
    if (req.user.role !== "patient") return res.status(403).json({ message: "Patient access required" });
const { id } = req.params; // plan id
    const { dayNumber, stage = "Unknown", mood = "", notes = "", completedTherapies = [] } = req.body;
    if (!dayNumber) return res.status(400).json({ message: "dayNumber is required" });

    const plan = await TreatmentPlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const day = plan.days.find(d => d.dayNumber === Number(dayNumber));
    if (!day) return res.status(400).json({ message: "Invalid dayNumber" });
    day.completed = true;
    day.notes = notes;

    // Grab latest vitals snapshot from smartwatch data if available
    const latestVitals = await SmartwatchData.findOne({ userId: req.user.id }).sort({ timestamp: -1 });
    const vitalsSnapshot = latestVitals?.vitals || undefined;

    await plan.save();

const log = new ProgressLog({
      patientId: req.user.id,
      planId: plan._id,
      dayNumber,
      stage,
      completedTherapies,
      mood,
      notes,
      vitalsSnapshot
    });
    await log.save();

    const total = plan.days.length;
    const done = plan.days.filter(d => d.completed).length;
    const percent = Math.round((done / total) * 100);

    if (done === total) plan.status = "completed", await plan.save();

    res.status(200).json({ message: "Day marked complete", progressPercent: percent, plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { id } = req.params; // plan id
    const plan = await TreatmentPlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const total = plan.days.length;
    const done = plan.days.filter(d => d.completed).length;
    const percent = total ? Math.round((done / total) * 100) : 0;

    const logs = await ProgressLog.find({ planId: id }).sort({ createdAt: -1 });
    res.status(200).json({ percent, total, done, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
