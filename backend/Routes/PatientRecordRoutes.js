import express from "express";
import { authenticateToken, isPatient, isDoctor } from "../Middlewares/AuthMIddleware.js";
import { getMyRecord, upsertMyRecord, getPatientRecord, upsertPatientRecord } from "../Controllers/PatientRecordController.js";

const router = express.Router();

// Patient self
router.get("/records/me", authenticateToken, isPatient, getMyRecord);
router.put("/records/me", authenticateToken, isPatient, upsertMyRecord);

// Doctor on patient
router.get("/records/patient/:patientId", authenticateToken, isDoctor, getPatientRecord);
router.put("/records/patient/:patientId", authenticateToken, isDoctor, upsertPatientRecord);

export default router;
