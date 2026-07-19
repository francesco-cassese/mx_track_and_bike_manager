import express from "express";
import authRouter from "./routes/authRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Configuro i middleware globali
app.use(express.json());

// Monto le routes
app.use('/auth', authRouter);

// Avvio il server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});