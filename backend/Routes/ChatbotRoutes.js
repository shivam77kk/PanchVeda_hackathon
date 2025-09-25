import express from "express";
import { authenticateToken } from "../Middlewares/AuthMIddleware.js";
import { startSession, getSession, sendMessage } from "../Controllers/ChatbotController.js";

const router = express.Router();

router.post("/chatbot/sessions", authenticateToken, startSession);
router.get("/chatbot/sessions/:id", authenticateToken, getSession);
router.post("/chatbot/sessions/:id/message", authenticateToken, sendMessage);

export default router;
