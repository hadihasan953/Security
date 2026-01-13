import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { auditMiddleware } from "../middlewares/audit.middleware.js";

const router = express.Router();

router.get("/me", authenticate, auditMiddleware, async (req, res) => {
    res.json(req.user);
});

export default router;