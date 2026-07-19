import express from "express";
import { Router } from "express";
import { index } from "../controllers/bikeContoller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.get('/', [authenticateToken, index]);

export default router;