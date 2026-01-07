import { PRIVILEGES } from "../constants/privileges.js";

export const authorizePrivilege = (privileges = []) => {
    return (req, res, next) => {
        try {
            const userPrivileges = req.user.privileges || [];
            // ADMIN_PRIVILEGE: allow all actions
            if (userPrivileges.includes(PRIVILEGES.ADMIN_PRIVILEGE)) {
                return next();
            }
            // MANAGE_USER: allow enable, disable, delete actions
            const manageActions = [PRIVILEGES.ENABLE_USER, PRIVILEGES.DISABLE_USER, PRIVILEGES.DELETE_USER];
            if (
                userPrivileges.includes(PRIVILEGES.MANAGE_USER) &&
                privileges.some(p => manageActions.includes(p))
            ) {
                return next();
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