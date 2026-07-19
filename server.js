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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});