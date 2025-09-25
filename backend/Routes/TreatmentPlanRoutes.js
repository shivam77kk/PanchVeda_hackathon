import express from "express";
import { authenticateToken, isDoctor, isPatient } from "../Middlewares/AuthMIddleware.js";
import { createPlan, getPlansForPatient, getPlanById, updatePlan, completeDay, getProgress } from "../Controllers/TreatmentPlanController.js";

const router = express.Router();

// Doctor creates/updates plans
router.post("/plans", authenticateToken, isDoctor, createPlan);
router.put("/plans/:id", authenticateToken, isDoctor, updatePlan);

// Fetch plans
router.get("/plans/patient/:patientId", authenticateToken, getPlansForPatient);
router.get("/plans/:id", authenticateToken, getPlanById);
router.get("/plans/:id/progress", authenticateToken, getProgress);

// Patient completes a day
router.post("/plans/:id/complete-day", authenticateToken, isPatient, completeDay);

export default router;
