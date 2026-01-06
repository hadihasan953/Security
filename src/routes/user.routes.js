import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIVILEGES } from "../constants/privileges.js";
import {
    disableUser,
    enableUser,
    deleteUser,
    // assignAdminRole
} from "../controllers/user.controller.js";

const router = express.Router();


// Only main_admin can manage users and assign admin role
// Privilege-based protection
router.patch("/:id/disabled", authenticate, authorizePrivilege([PRIVILEGES.DISABLE_USER]), disableUser);
router.patch("/:id/enabled", authenticate, authorizePrivilege([PRIVILEGES.ENABLE_USER]), enableUser);
router.delete("/:id", authenticate, authorizePrivilege([PRIVILEGES.DELETE_USER]), deleteUser);
// router.patch("/:id/role", authenticate, authorizeRole(["main_admin"]), assignAdminRole);

export default router;