import express from "express";
import { authenticateToken, isDoctor } from "../Middlewares/AuthMIddleware.js";
import { createOrUpdateGuideline, getGuideline, listGuidelines } from "../Controllers/GuidelinesController.js";

const router = express.Router();

router.post("/guidelines", authenticateToken, isDoctor, createOrUpdateGuideline);
router.get("/guidelines", authenticateToken, listGuidelines);
router.get("/guidelines/:therapyName", authenticateToken, getGuideline);

export default router;
