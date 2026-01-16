
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { auditMiddleware } from "../middlewares/audit/audit.factory.js";
import { AUDIT_ACTIONS } from "../middlewares/audit/audit.actions.js";
import { resolveTargetUserId } from "../middlewares/audit/audit.resolver.js";
import { PRIVILEGES } from "../constants/privileges.js";
import {
    disableUser,
    enableUser,
    deleteUser,
    updatePassword,
    // assignAdminRole
} from "../controllers/user.controller.js";
// import { assignPrivilegeToUser } from "../controllers/user.controller.js";

const router = express.Router();

// updates password
router.patch(
    "/me/password",
    authenticate,
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    updatePassword
);


// Only main_admin can manage users and assign admin role
// Privilege-based protection
router.patch(
    "/:id/disabled",
    authenticate,
    authorizePrivilege([PRIVILEGES.DISABLE_USER]),
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    disableUser
);
router.patch(
    "/:id/enabled",
    authenticate,
    authorizePrivilege([PRIVILEGES.ENABLE_USER]),
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    enableUser
);
router.delete(
    "/:id",
    authenticate,
    authorizePrivilege([PRIVILEGES.DELETE_USER]),
    auditMiddleware({ actionMap: AUDIT_ACTIONS, resolveTargetUserId }),
    deleteUser
);

export default router;