import express from "express";
import { Router } from "express";
import { index, show, store, update } from "../controllers/bikeContoller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { authorizeOwner } from "../middlewares/authorize.js";

const router = express.Router();

router.get('/', [authenticateToken, index]);

router.get('/:id', [authenticateToken, authorizeOwner('bike'), show]);

router.post('/', [authenticateToken, store])

router.put('/:id', [authenticateToken, authorizeOwner('bike'), update]);

export default router;