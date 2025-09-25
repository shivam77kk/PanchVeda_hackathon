import express from "express";
import { authenticateToken, isDoctor } from "../Middlewares/AuthMIddleware.js";
import { addMedication, listMedications, updateMedication } from "../Controllers/MedicationController.js";

const router = express.Router();

router.post("/plans/:id/medications", authenticateToken, isDoctor, addMedication);
router.get("/plans/:id/medications", authenticateToken, listMedications);
router.put("/plans/:id/medications/:medId", authenticateToken, isDoctor, updateMedication);

export default router;
