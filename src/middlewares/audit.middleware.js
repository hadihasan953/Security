// src/middlewares/audit.middleware.js
import { logAudit } from "../services/audit.service.js";

/**
 * Resolve audit action based on route + method
 * (USES ONLY YOUR RULES)
 */
function resolveAuditAction(req) {
    const method = req.method;
    const basePath = req.baseUrl;        // e.g. /api/auth, /api/users
    const routePath = req.route?.path;   // e.g. /login, /:id

    // AUTH
    if (basePath.includes("auth") && method === "POST" && routePath === "/login")
        return "LOGIN";

    if (basePath.includes("auth") && method === "POST" && routePath === "/register")
        return "AUTH_REGISTER";

    // USERS
    if (basePath.includes("users")) {
        if (method === "DELETE" && routePath === "/:id")
            return "USER_DELETE";

        if (method === "PATCH" && routePath === "/:id/disabled")
            return "USER_DISABLE";

        if (method === "PATCH" && routePath === "/:id/enabled")
            return "USER_ENABLE";

        if (basePath.includes("me") && method === "PATCH" && routePath === "/password")
            return "USER_PASSWORD_UPDATE";
    }

    // PRIVILEGES
    if (basePath.includes("privileges")) {
        if (method === "POST" && routePath === "/:id/privileges")
            return "PRIVILEGE_ASSIGN";

        if (method === "DELETE" && routePath === "/:id/privileges")
            return "PRIVILEGE_REVOKE";

        if (method === "GET" && routePath === "/dashboard/:id")
            return "VIEW_DASHBOARD";
    }

    return "UNKNOWN_ACTION";
}

/**
 * Resolve target user id (if any)
 */
function resolveTargetUserId(req) {
    // /users/:id
    if (req.params?.id) return req.params.id;

    // /privileges/:userId (if you have such routes)
    if (req.params?.userId) return req.params.userId;

    return null;
}

/**
 * FULL AUDIT MIDDLEWARE
 */
export const auditMiddleware = (req, res, next) => {
    res.on("finish", async () => {
        try {
            // Log ONLY successful responses
            if (res.statusCode < 200 || res.statusCode >= 300) return;

            const action = resolveAuditAction(req);

            if (action === "UNKNOWN_ACTION") {
                console.warn("Audit: UNKNOWN_ACTION route:", req.method, req.originalUrl);
                return;
            }

            const targetUserId = resolveTargetUserId(req);

            // For login/register, get user ID from the response or loginUserId stored
            let actorUserId = req.user?.id || req.token?.userId || req.loginUserId || null;

            await logAudit({
                actorUserId,
                action,
                targetUserId
            });
        } catch (error) {
            console.error("Audit middleware error:", error.message);
        }
    });

    next();
};
