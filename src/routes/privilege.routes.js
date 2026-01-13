import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIVILEGES } from "../constants/privileges.js";
import { User, Privilege } from "../models/index.js";

const router = express.Router();

// Grant a privilege to a user
router.post("/:id/privileges", authenticate, authorizePrivilege([PRIVILEGES.MANAGE_USER]), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const { privilege } = req.body;
        const priv = await Privilege.findOne({ where: { name: privilege } });
        if (!user || !priv) return res.status(404).json({ message: "User or privilege not found" });
        await user.addPrivilege(priv);
        // Audit log for privilege assignment
        const { logAudit } = await import("../utils/auditLogger.js");
        await logAudit({
            actorUserId: req.user.id,
            action: "ASSIGN_PRIVILEGE",
            targetType: "User",
            targetUserId: user.id,
            details: `Privilege '${privilege}' granted to user ${user.id}`
        });
        res.json({ message: `Privilege '${privilege}' granted to user.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Revoke a privilege from a user
router.delete("/:id/privileges", authenticate, authorizePrivilege([PRIVILEGES.MANAGE_USER]), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const { privilege } = req.body;
        const priv = await Privilege.findOne({ where: { name: privilege } });
        if (!user || !priv) return res.status(404).json({ message: "User or privilege not found" });
        await user.removePrivilege(priv);
        // Audit log for privilege revocation
        const { logAudit } = await import("../utils/auditLogger.js");
        await logAudit({
            actorUserId: req.user.id,
            action: "REVOKE_PRIVILEGE",
            targetType: "User",
            targetUserId: user.id,
            details: `Privilege '${privilege}' revoked from user ${user.id}`
        });
        res.json({ message: `Privilege '${privilege}' revoked from user.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// View dashboard route
router.get(
    "/dashboard/:id",
    authenticate,
    (req, res, next) => {
        const userPrivileges = req.user.privileges || [];
        const isAdmin = userPrivileges.includes(PRIVILEGES.ADMIN_PRIVILEGE);
        const canViewDashboard = userPrivileges.includes(PRIVILEGES.View_DASHBOARD);
        const requestedId = req.params.id;
        const isSelf = String(req.user.id) === String(requestedId);
        if (isAdmin || canViewDashboard || isSelf) {
            return next();
        }
        return res.status(403).json({ message: "Access denied" });
    },
    async (req, res) => {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: { exclude: ["password"] },
                paranoid: false, // include soft-deleted users
            });
            if (!user) return res.status(404).json({ message: "User not found" });
            // Audit log for dashboard view
            const { logAudit } = await import("../utils/auditLogger.js");
            await logAudit({
                actorUserId: req.user.id,
                action: "VIEW_DASHBOARD",
                targetType: "User",
                targetUserId: user.id,
                details: `Dashboard viewed for user ${user.id}`
            });
            res.json({ message: `Dashboard for ${user.name}`, user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
);


export default router;
