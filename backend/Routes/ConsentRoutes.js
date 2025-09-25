import express from "express";
import { authenticateToken, isDoctor, isPatient } from "../Middlewares/AuthMIddleware.js";
import { createConsentTemplate, listConsentTemplates, getConsentTemplate, signConsent, listMyConsents } from "../Controllers/ConsentController.js";

const router = express.Router();

// Doctor templates
router.post("/consents/templates", authenticateToken, isDoctor, createConsentTemplate);
router.get("/consents/templates", authenticateToken, listConsentTemplates);
router.get("/consents/templates/:id", authenticateToken, getConsentTemplate);

// Patient sign and list
router.post("/consents/sign", authenticateToken, isPatient, signConsent);
router.get("/consents/my", authenticateToken, isPatient, listMyConsents);

export default router;
