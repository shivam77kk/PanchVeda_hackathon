import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import TreatmentPlan from '../models/TreatmentPlanSchema.js';
import Medication from '../models/MedicationSchema.js';
import Appointment from '../models/AppointmentSchema.js';

dotenv.config({ path: 'C:/Users/hp/Desktop/PanchVeda_hackathon/.env' });

async function main() {
  const MONGO = process.env.MONGO_URL || process.env.MONGO_URI;
  if (!MONGO) throw new Error('MONGO_URL/MONGO_URI not set');
  await mongoose.connect(MONGO);

  // Upsert sample doctor
  const doctorEmail = 'dr.sarah@example.com';
  let doctor = await Doctor.findOne({ email: doctorEmail });
  if (!doctor) {
    doctor = new Doctor({
      name: 'Dr. Sarah Johnson',
      email: doctorEmail,
      age: 40,
      experience: 12,
      mode: 'Both',
      specialization: 'Panchakarma',
    });
    await doctor.save();
  }

  // Upsert sample patient
  const patientEmail = 'rajesh.kumar@example.com';
  let patient = await User.findOne({ email: patientEmail });
  if (!patient) {
    patient = new User({
      name: 'Rajesh Kumar',
      email: patientEmail,
      age: 28,
      gender: 'Other',
      bloodGroup: 'O+',
    });
    await patient.save();
  }

  // Create or reuse a treatment plan
  let plan = await TreatmentPlan.findOne({ patientId: patient._id, doctorId: doctor._id });
  const start = new Date();
  start.setHours(0,0,0,0);

  if (!plan) {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const templates = [
        { name: 'Consultation', instructions: 'Initial consult', phase: i<2?'Purvakarma': i<5?'Pradhankarma':'Paschatkarma', time: '08:00' },
        { name: i===2? 'Vamana (Supervised)' : (i===4? 'Basti' : 'Abhyanga + Swedana'), instructions: 'Hydrate; light satvik diet', phase: i<2?'Purvakarma': i<5?'Pradhankarma':'Paschatkarma', time: '10:00' },
        { name: 'Dietary Guidelines', instructions: 'Light warm meals', phase: i<2?'Purvakarma': i<5?'Pradhankarma':'Paschatkarma', time: '12:00' }
      ];
      return { dayNumber: i+1, date, therapies: templates, completed: i<2 };
    });

    plan = new TreatmentPlan({
      patientId: patient._id,
      doctorId: doctor._id,
      title: 'Complete Panchakarma',
      startDate: start,
      days
    });
    await plan.save();
  }

  // Seed medications
  const meds = [
    { name: 'Ashwagandha', dosage: '500mg', frequency: 'Twice daily', durationDays: 21 },
    { name: 'Triphala', dosage: '1 tsp', frequency: 'Before bed', durationDays: 21 }
  ];
  for (const m of meds) {
    const exists = await Medication.findOne({ planId: plan._id, name: m.name });
    if (!exists) {
      await new Medication({ ...m, planId: plan._id, doctorId: doctor._id, patientId: patient._id }).save();
    }
  }

  // Seed one appointment in accepted status if not present
  let appt = await Appointment.findOne({ patientId: patient._id, doctorId: doctor._id });
  if (!appt) {
    appt = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(Date.now() + 2*60*60*1000),
      durationMinutes: 30,
      concern: 'Back pain',
      treatmentType: 'General Consultation',
      status: 'accepted',
      events: [{ type: 'created', by: 'patient' }, { type: 'accepted', by: 'doctor' }]
    });
    await appt.save();
  }

  console.log('Seed complete:', {
    doctor: { id: doctor._id, email: doctor.email },
    patient: { id: patient._id, email: patient.email },
    plan: { id: plan._id, title: plan.title },
    medications: await Medication.countDocuments({ planId: plan._id }),
    appointment: appt._id
  });

  await mongoose.disconnect();
}

main().catch(e => { console.error('seed_sample error:', e); process.exit(1); });
