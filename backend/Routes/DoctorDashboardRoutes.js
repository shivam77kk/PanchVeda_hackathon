import express from "express";
import { authenticateToken, isDoctor } from "../Middlewares/AuthMIddleware.js";
import { getDoctorPatientPlansSummary, getPlanDailySchedule, getPlanPhases } from "../Controllers/DoctorDashboardController.js";

const router = express.Router();

router.get("/doctor/patients/plans", authenticateToken, isDoctor, getDoctorPatientPlansSummary);
router.get("/plans/:id/daily-schedule", authenticateToken, getPlanDailySchedule);
router.get("/plans/:id/phases", authenticateToken, getPlanPhases);

export default router;
