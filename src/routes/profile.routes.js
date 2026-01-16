import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { auditMiddleware } from "../middlewares/audit/audit.factory.js";
import { AUDIT_ACTIONS } from "../middlewares/audit/audit.actions.js";
import { resolveTargetUserId } from "../middlewares/audit/audit.resolver.js";

const router = express.Router();

router.get(
    "/me",
    authenticate,
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),

    async (req, res) => {
        res.json(req.user);
    }
);

export default router;