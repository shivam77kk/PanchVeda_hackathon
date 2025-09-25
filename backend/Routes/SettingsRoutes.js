import express from "express";
import { authenticateToken } from "../Middlewares/AuthMIddleware.js";
import { getMySettings, updateMySettings } from "../Controllers/SettingsController.js";

const router = express.Router();

router.get("/settings/me", authenticateToken, getMySettings);
router.put("/settings/me", authenticateToken, updateMySettings);

export default router;
