import express from "express";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

export default app;