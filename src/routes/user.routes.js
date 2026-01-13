
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { auditMiddleware } from "../middlewares/audit.middleware.js";
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
router.patch("/me/password", authenticate, auditMiddleware, updatePassword);


// Only main_admin can manage users and assign admin role
// Privilege-based protection
router.patch("/:id/disabled", authenticate, authorizePrivilege([PRIVILEGES.DISABLE_USER]), auditMiddleware, disableUser);
router.patch("/:id/enabled", authenticate, authorizePrivilege([PRIVILEGES.ENABLE_USER]), auditMiddleware, enableUser);
router.delete("/:id", authenticate, authorizePrivilege([PRIVILEGES.DELETE_USER]), auditMiddleware, deleteUser);

export default router;