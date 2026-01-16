import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { auditMiddleware } from "../middlewares/audit/audit.factory.js";
import { AUDIT_ACTIONS } from "../middlewares/audit/audit.actions.js";
import { resolveTargetUserId } from "../middlewares/audit/audit.resolver.js";

const router = express.Router();

router.post(
    "/register",
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    register
);
router.post(
    "/login",
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    login
);

export default router;