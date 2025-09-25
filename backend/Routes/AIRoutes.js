import express from "express";
import { authenticateToken } from "../Middlewares/AuthMIddleware.js";
import { recommendPlan, predictOutcome } from "../Controllers/AIController.js";

const router = express.Router();

router.post("/ai/recommend-plan", authenticateToken, recommendPlan); // doctor or patient can call with data
router.post("/ai/outcome-prediction", authenticateToken, predictOutcome);

export default router;
