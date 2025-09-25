import Feedback from "../models/FeedbackSchema.js";

export const submitFeedback = async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ message: 'Patient access required' });
    const body = req.body || {};
    const fb = new Feedback({ ...body, patientId: req.user.id });
    await fb.save();
    res.status(201).json({ message: 'Feedback submitted', feedback: fb });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyFeedbackSeries = async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ message: 'Patient access required' });
    const series = await Feedback.find({ patientId: req.user.id }).sort({ date: 1 });
    res.status(200).json({ series });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientFeedbackSeries = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { patientId } = req.params;
    const series = await Feedback.find({ patientId }).sort({ date: 1 });
    res.status(200).json({ series });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
