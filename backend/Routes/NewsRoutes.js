import express from "express";
import { authenticateToken } from "../Middlewares/AuthMIddleware.js";
import { getPanchakarmaNews } from "../Controllers/NewsController.js";

const router = express.Router();

router.get("/news/panchakarma", authenticateToken, getPanchakarmaNews);

export default router;
