import express from "express";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import userRoutes from "./routes/user.routes.js";
import privilegeRoutes from "./routes/privilege.routes.js";
import testRoutes from "./routes/test.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/users", userRoutes)


app.use("/api", testRoutes);
app.use("/privileges", privilegeRoutes);

export default app;