import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import {
    disableUser,
    enableUser,
    deleteUser,
    assignAdminRole
} from "../controllers/user.controller.js";

const router = express.Router();


// Only main_admin can manage users and assign admin role
router.patch("/:id/disabled", authenticate, authorizeRole(["main_admin"]), disableUser);
router.patch("/:id/enabled", authenticate, authorizeRole(["main_admin"]), enableUser);
router.delete("/:id", authenticate, authorizeRole(["main_admin"]), deleteUser);
router.patch("/:id/role", authenticate, authorizeRole(["main_admin"]), assignAdminRole);

export default router;