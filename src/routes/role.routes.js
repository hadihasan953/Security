import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { ROLES } from "../constants/roles.js";
import { updateUserRole } from "../controllers/role.controller.js";

const router = express.Router();

router.patch("/:id/role", authenticate, authorizeRole([ROLES.MANAGE_USER]), updateUserRole);

export default router;