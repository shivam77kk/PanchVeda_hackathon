import express from "express";
import { authenticateToken, isPatient, isDoctor } from "../Middlewares/AuthMIddleware.js";
import { submitFeedback, getMyFeedbackSeries, getPatientFeedbackSeries } from "../Controllers/FeedbackController.js";

const router = express.Router();

router.post("/feedback", authenticateToken, isPatient, submitFeedback);
router.get("/feedback/my", authenticateToken, isPatient, getMyFeedbackSeries);
router.get("/feedback/patient/:patientId", authenticateToken, isDoctor, getPatientFeedbackSeries);

export default router;
