import Appointment from "../models/AppointmentSchema.js";
import Visit from "../models/VisitSchema.js";
import SmartwatchData from "../models/SmartWatchSchema.js";

const assertRole = (req, role) => {
  if (!req.user || req.user.role !== role) {
    const err = new Error(`${role} access required`);
    err.status = 403;
    throw err;
  }
};

// Patient: create appointment
export const createAppointment = async (req, res) => {
  try {
    assertRole(req, 'patient');
    const { doctorId, scheduledAt, durationMinutes = 30, concern = '', treatmentType = 'General Consultation', mode = 'Both', location = '', language = [], fee = 0 } = req.body;
    if (!doctorId || !scheduledAt) return res.status(400).json({ message: 'doctorId and scheduledAt are required' });

    const appt = new Appointment({
      patientId: req.user.id,
      doctorId,
      scheduledAt: new Date(scheduledAt),
      durationMinutes,
      concern,
      treatmentType,
      mode,
      location,
      language,
      fee,
      status: 'pending',
      events: [{ type: 'created', by: 'patient' }]
    });
    await appt.save();
    res.status(201).json({ message: 'Appointment created', appointment: appt });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Patient: reschedule
export const rescheduleByPatient = async (req, res) => {
  try {
    assertRole(req, 'patient');
    const { id } = req.params;
    const { scheduledAt } = req.body;
    if (!scheduledAt) return res.status(400).json({ message: 'scheduledAt is required' });

    const appt = await Appointment.findOne({ _id: id, patientId: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (['cancelled_by_patient','cancelled_by_doctor','completed','rejected'].includes(appt.status)) {
      return res.status(400).json({ message: `Cannot reschedule in status ${appt.status}` });
    }

    appt.scheduledAt = new Date(scheduledAt);
    appt.status = 'rescheduled';
    appt.events.push({ type: 'rescheduled_by_patient', by: 'patient' });
    await appt.save();
    res.status(200).json({ message: 'Rescheduled', appointment: appt });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Patient: cancel
export const cancelByPatient = async (req, res) => {
  try {
    assertRole(req, 'patient');
    const { id } = req.params;
    const appt = await Appointment.findOne({ _id: id, patientId: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    appt.status = 'cancelled_by_patient';
    appt.events.push({ type: 'cancelled_by_patient', by: 'patient' });
    await appt.save();
    res.status(200).json({ message: 'Cancelled', appointment: appt });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Doctor: list
export const getDoctorAppointments = async (req, res) => {
  try {
    assertRole(req, 'doctor');
    const appts = await Appointment.find({ doctorId: req.user.id }).sort({ scheduledAt: 1 });
    res.status(200).json({ appointments: appts });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Patient: list
export const getMyAppointments = async (req, res) => {
  try {
    assertRole(req, 'patient');
    const appts = await Appointment.find({ patientId: req.user.id }).sort({ scheduledAt: -1 });
    res.status(200).json({ appointments: appts });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Doctor accept
export const acceptByDoctor = async (req, res) => {
  try {
    assertRole(req, 'doctor');
    const { id } = req.params;
    const appt = await Appointment.findOne({ _id: id, doctorId: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    appt.status = 'accepted';
    appt.events.push({ type: 'accepted', by: 'doctor' });
    await appt.save();
    res.status(200).json({ message: 'Accepted', appointment: appt });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Doctor reschedule
export const rescheduleByDoctor = async (req, res) => {
  try {
    assertRole(req, 'doctor');
    const { id } = req.params; const { scheduledAt } = req.body;
    const appt = await Appointment.findOne({ _id: id, doctorId: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    appt.scheduledAt = new Date(scheduledAt);
    appt.status = 'rescheduled';
    appt.events.push({ type: 'rescheduled_by_doctor', by: 'doctor' });
    await appt.save();
    res.status(200).json({ message: 'Rescheduled', appointment: appt });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Doctor cancel
export const cancelByDoctor = async (req, res) => {
  try {
    assertRole(req, 'doctor');
    const { id } = req.params;
    const appt = await Appointment.findOne({ _id: id, doctorId: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    appt.status = 'cancelled_by_doctor';
    appt.events.push({ type: 'cancelled_by_doctor', by: 'doctor' });
    await appt.save();
    res.status(200).json({ message: 'Cancelled', appointment: appt });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Doctor complete appointment -> create visit record
export const completeAppointment = async (req, res) => {
  try {
    assertRole(req, 'doctor');
    const { id } = req.params; const { summary = '', followUpRecommended = false, nextVisitAt } = req.body;
    const appt = await Appointment.findOne({ _id: id, doctorId: req.user.id });
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    appt.status = 'completed';
    appt.events.push({ type: 'completed', by: 'doctor' });
    await appt.save();

    const visit = new Visit({
      appointmentId: appt._id,
      patientId: appt.patientId,
      doctorId: appt.doctorId,
      date: new Date(),
      treatmentType: appt.treatmentType,
      summary,
      followUpRecommended,
      nextVisitAt: nextVisitAt ? new Date(nextVisitAt) : undefined
    });
    await visit.save();

    res.status(200).json({ message: 'Appointment completed', appointment: appt, visit });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// Histories
export const getPatientVisitHistory = async (req, res) => {
  try {
    assertRole(req, 'patient');
    const visits = await Visit.find({ patientId: req.user.id }).sort({ date: -1 });
    res.status(200).json({ visits });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getDoctorPatientHistory = async (req, res) => {
  try {
    assertRole(req, 'doctor');
    const { patientId } = req.query;
    const match = { doctorId: req.user.id };
    if (patientId) match.patientId = patientId;
    const visits = await Visit.find(match).sort({ date: -1 });

    // Attach latest vitals for each patient
    const enriched = await Promise.all(visits.map(async (v) => {
      const latest = await SmartwatchData.findOne({ userId: v.patientId }).sort({ timestamp: -1 });
      return { ...v.toObject(), latestVitals: latest?.vitals || null };
    }));

    res.status(200).json({ visits: enriched });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
