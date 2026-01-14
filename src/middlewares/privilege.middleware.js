import { PRIV } from "../services/privilege.service.js";

export const authorizePrivilege = (privileges = []) => {
    return async (req, res, next) => {
        try {
            const userPrivileges = req.user.privileges || [];

            // allow all action to admin
            if (userPrivileges.includes(PRIV.ADMIN_PRIVILEGE)) {
                return next();
            }

            // allow enable, disable, delete actions to manage_user
            const manageActions = [PRIV.ENABLE_USER, PRIV.DISABLE_USER, PRIV.DELETE_USER];
            if (userPrivileges.includes(PRIV.MANAGE_USER)) {
                // Only allow if the required privilege is one of the manage actions
                if (privileges.every(p => manageActions.includes(p))) {
                    return next();
                } else {
                    return res.status(403).json({ message: "Access denied" });
                }
            }

            if (!privileges.some(p => userPrivileges.includes(p))) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
