import { PRIVILEGES } from "../constants/privileges.js";

export const authorizePrivilege = (privileges = []) => {
    return async (req, res, next) => {
        try {
            const userPrivileges = req.user.privileges || [];

            // allow all action to admin
            if (userPrivileges.includes(ADMIN_PRIVILEGE)) {
                return next();
            }

            // allow enable, disable, delete actions to manage_user
            const manageActions = [ENABLE_USER, DISABLE_USER, DELETE_USER];
            if (userPrivileges.includes(MANAGE_USER)) {
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
