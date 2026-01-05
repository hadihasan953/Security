import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";
import {
    disableUser,
    enableUser,
    deleteUser,
    // assignAdminRole
} from "../controllers/user.controller.js";

const router = express.Router();


// Only main_admin can manage users and assign admin role
router.patch("/:id/disabled", authenticate, authorizeRole([ROLES.MANAGE_USER]), disableUser);
router.patch("/:id/enabled", authenticate, authorizeRole([ROLES.MANAGE_USER]), enableUser);
router.delete("/:id", authenticate, authorizeRole([ROLES.MANAGE_USER]), deleteUser);
// router.patch("/:id/role", authenticate, authorizeRole(["main_admin"]), assignAdminRole);

export default router;