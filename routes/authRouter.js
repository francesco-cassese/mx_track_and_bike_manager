import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Registrazione di un nuovo utente
router.post('/register', register);

// Login: verifico le credenziali e restituisco un JWT
router.post('/login', login);

export default router;