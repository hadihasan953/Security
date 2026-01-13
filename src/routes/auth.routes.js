import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { auditMiddleware } from "../middlewares/audit.middleware.js";

const router = express.Router();

router.post("/register", auditMiddleware, register);
router.post("/login", auditMiddleware, login);

export default router;