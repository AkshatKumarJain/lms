import express from "express";
import { connectDB } from "./db/connection";
import userRouter from "./routes/user.route"

const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1", userRouter);

app.get("/health", (_, res) => {
    res.send("api is running");
});

export default app;