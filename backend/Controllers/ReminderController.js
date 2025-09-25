import Reminder from "../models/ReminderSchema.js";

export const getTodayReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const reminders = await Reminder.find({ patientId: userId, scheduledAt: { $gte: start, $lte: end } }).sort({ scheduledAt: 1 });
    res.status(200).json({ reminders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCustomReminder = async (req, res) => {
  try {
    const { scheduledAt, message, category = 'general', patientId } = req.body;
    if (!scheduledAt || !message) return res.status(400).json({ message: 'scheduledAt and message are required' });

    // doctor can create for any patient; patient can only create for self
    const targetPatientId = req.user.role === 'doctor' ? (patientId || req.user.id) : req.user.id;

    const reminder = new Reminder({ patientId: targetPatientId, scheduledAt: new Date(scheduledAt), message, category, status: 'pending' });
    await reminder.save();
    res.status(201).json({ message: 'Reminder created', reminder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.query;
    const query = { patientId: userId };
    if (category) query.category = category;
    const reminders = await Reminder.find(query).sort({ scheduledAt: 1 });
    res.status(200).json({ reminders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markReminderSent = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findOneAndUpdate({ _id: id, patientId: req.user.id }, { status: "sent", sentAt: new Date() }, { new: true });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });
    res.status(200).json({ message: "Reminder marked as sent", reminder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
