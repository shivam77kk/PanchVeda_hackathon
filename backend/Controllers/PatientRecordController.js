import PatientRecord from "../models/PatientRecordSchema.js";

const canEditRecord = (req, targetUserId) => {
  if (!req.user) return false;
  if (req.user.role === 'patient' && String(req.user.id) === String(targetUserId)) return true;
  if (req.user.role === 'doctor') return true; // doctors can edit patient's record
  return false;
};

export const getMyRecord = async (req, res) => {
  try {
    const record = await PatientRecord.findOne({ userId: req.user.id });
    res.status(200).json({ record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertMyRecord = async (req, res) => {
  try {
    const updates = req.body || {};
    if (!canEditRecord(req, req.user.id)) return res.status(403).json({ message: 'Not authorized' });

    const record = await PatientRecord.findOneAndUpdate(
      { userId: req.user.id },
      { ...updates, lastUpdatedBy: { id: req.user.id, role: req.user.role, at: new Date() } },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Record saved', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientRecord = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { patientId } = req.params;
    const record = await PatientRecord.findOne({ userId: patientId });
    res.status(200).json({ record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertPatientRecord = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Doctor access required' });
    const { patientId } = req.params;
    const updates = req.body || {};
    if (!canEditRecord(req, patientId)) return res.status(403).json({ message: 'Not authorized' });

    const record = await PatientRecord.findOneAndUpdate(
      { userId: patientId },
      { ...updates, lastUpdatedBy: { id: req.user.id, role: req.user.role, at: new Date() } },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: 'Record saved', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
