import express from "express";
import { authenticateToken, isPatient, isDoctor } from "../Middlewares/AuthMIddleware.js";
import {
  createAppointment,
  rescheduleByPatient,
  cancelByPatient,
  getDoctorAppointments,
  getMyAppointments,
  acceptByDoctor,
  rescheduleByDoctor,
  cancelByDoctor,
  completeAppointment,
  getPatientVisitHistory,
  getDoctorPatientHistory
} from "../Controllers/AppointmentController.js";

const router = express.Router();

// Patient actions
router.post("/appointments", authenticateToken, isPatient, createAppointment);
router.post("/appointments/:id/reschedule", authenticateToken, isPatient, rescheduleByPatient);
router.post("/appointments/:id/cancel", authenticateToken, isPatient, cancelByPatient);
router.get("/appointments/my", authenticateToken, isPatient, getMyAppointments);
router.get("/visits/my", authenticateToken, isPatient, getPatientVisitHistory);

// Doctor actions
router.get("/appointments/doctor", authenticateToken, isDoctor, getDoctorAppointments);
router.post("/appointments/:id/accept", authenticateToken, isDoctor, acceptByDoctor);
router.post("/appointments/:id/doctor-reschedule", authenticateToken, isDoctor, rescheduleByDoctor);
router.post("/appointments/:id/doctor-cancel", authenticateToken, isDoctor, cancelByDoctor);
router.post("/appointments/:id/complete", authenticateToken, isDoctor, completeAppointment);
router.get("/visits/doctor", authenticateToken, isDoctor, getDoctorPatientHistory);

export default router;
