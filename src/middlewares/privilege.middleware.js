import { PRIVILEGES } from "../constants/privileges.js";
import { AuditLog } from "../models/index.js";

export const authorizePrivilege = (privileges = []) => {
    return async (req, res, next) => {
        try {
            const userPrivileges = req.user.privileges || [];

            // allow all action to admin
            if (userPrivileges.includes(PRIVILEGES.ADMIN_PRIVILEGE)) {
                return next();
            }

            // allow enable, disable, delete actions to manage_user
            const manageActions = [PRIVILEGES.ENABLE_USER, PRIVILEGES.DISABLE_USER, PRIVILEGES.DELETE_USER];
            if (userPrivileges.includes(PRIVILEGES.MANAGE_USER)) {
                // Only allow if the required privilege is one of the manage actions
                if (privileges.every(p => manageActions.includes(p))) {
                    return next();
                } else {
                    // ✅ AUDIT LOG: Access denied attempt
                    await AuditLog.create({
                        actorUserId: req.user.id,
                        action: "ACCESS_DENIED",
                        entityType: "Privilege",
                        entityId: null,
                        details: `User attempted unauthorized privilege action: ${privileges.join(", ")}`
                    });
                    return res.status(403).json({ message: "Access denied" });
                }
            }

            if (!privileges.some(p => userPrivileges.includes(p))) {
                // ✅ AUDIT LOG: Access denied attempt
                await AuditLog.create({
                    actorUserId: req.user.id,
                    action: "ACCESS_DENIED",
                    entityType: "Privilege",
                    entityId: null,
                    details: `User attempted unauthorized privilege action: ${privileges.join(", ")}`
                });
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
