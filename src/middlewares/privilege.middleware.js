// Privilege-based authorization middleware
import { PRIVILEGES } from "../constants/privileges.js";

export const authorizePrivilege = (privileges = []) => {
    return (req, res, next) => {
        try {
            const userPrivileges = req.user.privileges || [];
            // If user has MANAGE_USER privilege, allow all actions
            if (userPrivileges.includes(PRIVILEGES.MANAGE_USER)) {
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