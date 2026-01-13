import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIVILEGES } from "../constants/privileges.js";

const router = express.Router();

router.get("/audit", authenticate, authorizePrivilege([PRIVILEGES.ADMIN_PRIVILEGE]), async (req, res) => {
    const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]] });
    res.json(logs);
});
export default router;