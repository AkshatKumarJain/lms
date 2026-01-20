import express from "express";
import { connectDB } from "./db/connection";
import userRouter from "./routes/user.route"
import cors from "cors"

const app = express();

app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:8000", "*"],
  credentials: true
}));


connectDB();

app.use("/api/v1", userRouter);

app.get("/health", (_, res) => {
    res.send("api is running");
});

export default app;