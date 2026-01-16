import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIV } from "../services/privilege.service.js";
import { AuditLog } from "../models/index.js";
import { auditMiddleware } from "../middlewares/audit/audit.factory.js";
import { AUDIT_ACTIONS } from "../middlewares/audit/audit.actions.js";
import { resolveTargetUserId } from "../middlewares/audit/audit.resolver.js";

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorizePrivilege([PRIV.ADMIN_PRIVILEGE]),
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    async (req, res) => {
        const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]] });
        res.json(logs);
    }
);

export default router;