import express from "express";
import { authenticateToken, isDoctor } from "../Middlewares/AuthMIddleware.js";
import { createOrUpdatePrep, getPrep, listPrep } from "../Controllers/PrepController.js";

const router = express.Router();

router.post("/prep", authenticateToken, isDoctor, createOrUpdatePrep);
router.get("/prep", authenticateToken, listPrep);
router.get("/prep/:therapyName", authenticateToken, getPrep);

export default router;
