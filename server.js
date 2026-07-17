import express from "express";
import authRouter from "./routes/authRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRouter);

// Server initialization
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});