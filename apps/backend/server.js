import express from "express";
import authRouter from "./routes/authRouter.js";
import bikeRouter from "./routes/bikeRouter.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors())
app.use(express.json());

// routes
app.use('/auth', authRouter);
app.use('/bike', bikeRouter);

/**
 * Centralizzo la gestione degli errori: intercetto quelli inoltrati da asyncHandler
 * ed evito di ripetere lo stesso blocco di log + risposta 500 in ogni controller.
 */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Errore interno del server"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});