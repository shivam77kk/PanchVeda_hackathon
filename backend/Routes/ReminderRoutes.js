import express from "express";
import { authenticateToken, isPatient } from "../Middlewares/AuthMIddleware.js";
import { getTodayReminders, markReminderSent, listReminders, createCustomReminder } from "../Controllers/ReminderController.js";

const router = express.Router();

router.get("/reminders/today", authenticateToken, isPatient, getTodayReminders);
router.get("/reminders", authenticateToken, isPatient, listReminders);
router.post("/reminders/custom", authenticateToken, createCustomReminder);
router.post("/reminders/:id/sent", authenticateToken, isPatient, markReminderSent);

export default router;
