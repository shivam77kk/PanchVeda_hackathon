import Medication from "../models/MedicationSchema.js";
import TreatmentPlan from "../models/TreatmentPlanSchema.js";

export const addMedication = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { id } = req.params; // plan id
    const { name, dosage = '', frequency = '', durationDays = 0, startDate = new Date() } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });

    const plan = await TreatmentPlan.findById(id);
    if (!plan || String(plan.doctorId) !== String(req.user.id)) return res.status(403).json({ message: 'Not authorized for this plan' });

    const med = new Medication({ planId: id, doctorId: req.user.id, patientId: plan.patientId, name, dosage, frequency, durationDays, startDate });
    await med.save();
    res.status(201).json({ message: 'Medication added', medication: med });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const listMedications = async (req, res) => {
  try {
    const { id } = req.params; // plan id
    const meds = await Medication.find({ planId: id }).sort({ createdAt: -1 });
    res.status(200).json({ medications: meds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMedication = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { id, medId } = req.params;
    const plan = await TreatmentPlan.findById(id);
    if (!plan || String(plan.doctorId) !== String(req.user.id)) return res.status(403).json({ message: 'Not authorized for this plan' });
    const updates = req.body || {};
    const med = await Medication.findOneAndUpdate({ _id: medId, planId: id }, updates, { new: true });
    res.status(200).json({ message: 'Medication updated', medication: med });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
