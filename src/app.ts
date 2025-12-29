import express from "express";
import { connectDB } from "./db/connection";

const app = express();

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("api is running");
});

export default app;