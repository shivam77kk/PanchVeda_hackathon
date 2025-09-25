import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

// Models
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';

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

async function call(method, path, token, body, extra = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : undefined,
      ...extra.headers
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: extra.redirect || 'manual'
  });
  let json; try { json = await res.json(); } catch { json = await res.text(); }
  log(path, res.status, json);
  return { status: res.status, body: json };
}

async function run() {
  await new Promise(r => setTimeout(r, 500));

  const { doctor, patient, doctorJwt, patientJwt } = await getTokens();

  // Guidelines (doctor creates, anyone authenticated lists/gets)
  await call('POST', '/api/guidelines', doctorJwt, {
    therapyName: 'Abhyanga',
    language: 'en',
    preInstructions: ['Arrive hydrated'],
    postInstructions: ['Rest and hydrate']
  });
  await call('GET', '/api/guidelines', patientJwt);
  await call('GET', '/api/guidelines/Abhyanga?language=en', patientJwt);

  // Consents flow
  const tpl = await call('POST', '/api/consents/templates', doctorJwt, {
    name: 'Abhyanga Consent',
    treatmentName: 'Abhyanga',
    content: 'I consent to Abhyanga therapy.'
  });
  const templateId = tpl?.body?.template?._id;
  await call('GET', '/api/consents/templates', patientJwt);
  if (templateId) {
    await call('GET', `/api/consents/templates/${templateId}`, patientJwt);
    await call('POST', '/api/consents/sign', patientJwt, {
      templateId,
      signedByName: 'Rajesh Kumar',
      signatureHash: 'deadbeefcafebabe',
      doctorId: doctor._id.toString()
    });
  }
  await call('GET', '/api/consents/my', patientJwt);

  // Settings
  await call('GET', '/api/settings/me', patientJwt);
  await call('PUT', '/api/settings/me', patientJwt, { language: 'en', voice: 'neutral' });

  // Patient Documents (list only; upload requires multipart/cloudinary)
  await call('GET', '/api/documents/', patientJwt);

  // Smartwatch endpoints (safe ones)
  await call('GET', '/api/smartwatch/data', patientJwt);
  await call('GET', '/api/smartwatch/vitals/latest', patientJwt);
  await call('POST', '/api/smartwatch/sync-and-clean');

  // Doctor endpoints beyond dashboard
  await call('GET', '/api/doctors', patientJwt); // public list
  await call('GET', `/api/doctors/profile/${doctor._id}`, doctorJwt);
  await call('GET', '/api/doctors/documents', doctorJwt); // may return empty
  await call('GET', `/api/doctors/patients/${patient._id}/history`, doctorJwt);
  await call('POST', '/api/doctors/logout', doctorJwt);

  await mongoose.disconnect();
  console.log('Extra route smoke test complete');
}

run().catch(e => { console.error('route_smoke_extra error:', e); process.exit(1); });
