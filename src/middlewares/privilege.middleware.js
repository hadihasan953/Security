import { PRIVILEGES } from "../constants/privileges.js";

export const authorizePrivilege = (privileges = []) => {
    return (req, res, next) => {
        try {
            const userPrivileges = req.user.privileges || [];
            // allow all action to admin
            if (userPrivileges.includes(PRIVILEGES.ADMIN_PRIVILEGE)) {
                return next();
            }
            //allow enable, disable, delete actions to manage_user
            const manageActions = [PRIVILEGES.ENABLE_USER, PRIVILEGES.DISABLE_USER, PRIVILEGES.DELETE_USER];
            if (userPrivileges.includes(PRIVILEGES.MANAGE_USER)) {
                // Only allow if the required privilege is one of the manage actions
                if (privileges.every(p => manageActions.includes(p))) {
                    return next();
                } else {
                    // Block MANAGE_USER from granting/revoking privileges or any other action
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