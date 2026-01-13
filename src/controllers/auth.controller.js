import { registerUser, loginUser } from "../services/auth.service.js";
import { AuditLog } from "../models/index.js";
import { logAudit } from "../utils/auditLogger.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        // ✅ AUDIT LOG
        await logAudit({
            actorUserId: user.id,
            action: "REGISTER",
            targetType: "User",
            targetUserId: user.id,
            details: `User registered successfully with email ${user.email}`
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        // Optional: log failed registration attempt
        await logAudit({
            actorUserId: null,
            action: "REGISTER_FAILED",
            targetType: "User",
            targetUserId: null,
            details: `Failed registration attempt: ${error.message}, email: ${req.body.email}`
        });

        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const token = await loginUser(req.body);

        // ✅ AUDIT LOG: successful login
        await logAudit({
            actorUserId: token.userId || null,
            action: "LOGIN_SUCCESS",
            targetType: "User",
            targetUserId: token.userId || null,
            details: `User logged in successfully with email ${req.body.email}`
        });

        res.json({ token });
    } catch (error) {
        // ✅ AUDIT LOG: failed login attempt
        await logAudit({
            actorUserId: null,
            action: "LOGIN_FAILED",
            targetType: "User",
            targetUserId: null,
            details: `Failed login attempt for email ${req.body.email}, reason: ${error.message}`
        });

        res.status(400).json({ error: error.message });
    }
};
