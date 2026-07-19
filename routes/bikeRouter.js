import express from "express";
import { Router } from "express";
import { index } from "../controllers/bikeContoller";

const router = express.Router();

router.get('/', index);

export default router;