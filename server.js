import express from "express";
import registerRouter from "./routes/registerRouter.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.use('/register', registerRouter);

app.listen(PORT, () => {
    console.log('Server in ascolto sulla porta', PORT);
})