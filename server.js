import express from "express";
import authRouter from "./routes/authRouter.js";
import bikeRouter from "./routes/bikeRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globali
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/bike', bikeRouter);

// Error-handler centralizzato: intercetta gli errori inoltrati da asyncHandler
// ed evita di ripetere lo stesso blocco di log + risposta 500 in ogni controller.
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