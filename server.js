import express from "express";
import registerRouter from "./routes/registerRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/register', registerRouter);

// Server initialization
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});