import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIV } from "../services/privilege.service.js";
import { AuditLog } from "../models/index.js";

const router = express.Router();

router.get("/", authenticate, authorizePrivilege([PRIV.ADMIN_PRIVILEGE]), async (req, res) => {
    const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]] });
    res.json(logs);
});

export default router;