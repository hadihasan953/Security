import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import { updateUserRole } from "../controllers/role.controller.js";

const router = express.Router();

router.patch("/:id/role", authenticate, authorizeRole(["main_admin"]), updateUserRole);

export default router;