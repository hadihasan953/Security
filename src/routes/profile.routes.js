import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authenticate, async (req, res) => {
    // Audit log for profile view
    const { logAudit } = await import("../utils/auditLogger.js");
    await logAudit({
        actorUserId: req.user.id,
        action: "VIEW_PROFILE",
        targetType: "User",
        targetUserId: req.user.id,
        details: `Profile viewed for user ${req.user.id}`
    });
    res.json(req.user);
});

export default router;