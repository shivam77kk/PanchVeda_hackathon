import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

// Models
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import TreatmentPlan from '../models/TreatmentPlanSchema.js';

// Start server in-process
import '../index.js';

dotenv.config({ path: 'C:/Users/hp/Desktop/PanchVeda_hackathon/.env' });

const BASE = 'http://localhost:' + (process.env.PORT || 5000);

function log(label, status, body) {
  const short = typeof body === 'string' ? body.slice(0, 250) : JSON.stringify(body).slice(0, 250);
  console.log(label, status, short);
}

async function getTokens() {
  await mongoose.connect(process.env.MONGO_URL || process.env.MONGO_URI);
  const doctor = await Doctor.findOne({ email: 'dr.sarah@example.com' });
  const patient = await User.findOne({ email: 'rajesh.kumar@example.com' });
  if (!doctor || !patient) throw new Error('Seed data missing. Run seed_sample.mjs first');
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const doctorJwt = jwt.sign({ id: doctor._id, role: 'doctor' }, secret, { expiresIn: '1h' });
  const patientJwt = jwt.sign({ id: patient._id, role: 'patient' }, secret, { expiresIn: '1h' });
  return { doctor, patient, doctorJwt, patientJwt };
}

async function call(method, path, token, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined
    },
    body: body ? JSON.stringify(body) : undefined
  });
  let json; try { json = await res.json(); } catch { json = await res.text(); }
  log(path, res.status, json);
  return { status: res.status, body: json };
}

async function run() {
  // give server a tiny moment to start
  await new Promise(r => setTimeout(r, 500));

  const { doctor, patient, doctorJwt, patientJwt } = await getTokens();
  const plan = await TreatmentPlan.findOne({ doctorId: doctor._id, patientId: patient._id });

  // Doctor dashboard
  await call('GET', '/api/doctor/patients/plans', doctorJwt);
  if (plan) {
    await call('GET', `/api/plans/${plan._id}/daily-schedule`, doctorJwt);
    await call('GET', `/api/plans/${plan._id}/phases`, doctorJwt);
    await call('GET', `/api/plans/${plan._id}/medications`, doctorJwt);
  }

  // Patient records
  await call('GET', `/api/records/patient/${patient._id}`, doctorJwt);
  await call('GET', `/api/records/me`, patientJwt);

  // News
  await call('GET', '/api/news/panchakarma', patientJwt);

  // AI endpoints (use fallbacks if API unreachable)
  await call('POST', '/api/ai/recommend-plan', doctorJwt, { patientProfile: { age: patient.age, gender: 'Other' }, diseaseSeverity: 'moderate', goals: 'energy' });
  await call('POST', '/api/ai/outcome-prediction', doctorJwt, { adherencePercent: 75, symptoms: [{ name: 'fatigue', severity: 5 }], vitals: { hr: 78 } });

  // Feedback and Reminders
  await call('GET', '/api/feedback/my', patientJwt);
  await call('GET', '/api/reminders/today', patientJwt);

  // Appointments
  await call('GET', '/api/appointments/doctor', doctorJwt);
  await call('GET', '/api/appointments/my', patientJwt);

  // Chatbot: create session and send a message
  const ses = await call('POST', '/api/chatbot/sessions', patientJwt, {});
  const sessionId = ses?.body?.sessionId;
  if (sessionId) {
    await call('POST', `/api/chatbot/sessions/${sessionId}/message`, patientJwt, { message: 'Feeling tired today', mood: 'low', currentDay: 3 });
  }

  await mongoose.disconnect();
  console.log('Route smoke test complete');
}

run().catch(e => { console.error('route_smoke error:', e); process.exit(1); });
