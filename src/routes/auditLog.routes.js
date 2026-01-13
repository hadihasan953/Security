import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIVILEGES } from "../constants/privileges.js";
import { getAuditLogs } from "../controllers/auditLog.controller.js";

const router = express.Router();

router.get("/audit-logs", authenticate, authorizePrivilege([PRIVILEGES.ADMIN_PRIVILEGE]), getAuditLogs);

export default router;