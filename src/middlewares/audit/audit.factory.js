// src/middlewares/audit/audit.factory.js

import { logAudit } from "../../services/audit.service.js";

export function auditMiddleware({
    actionMap,
    resolveTargetUserId
}) {
    return (req, res, next) => {
        res.on("finish", async () => {
            try {
                if (res.statusCode < 200 || res.statusCode >= 300) return;

                const key = `${req.method} ${req.baseUrl}${req.route?.path}`;
                console.log('AUDIT KEY:', key);
                const action = actionMap ? actionMap[key] : null;

                if (!action) return;

                const actorUserId =
                    req.user?.id ||
                    req.token?.userId ||
                    req.loginUserId ||
                    null;

                const targetUserId = resolveTargetUserId(req);

                await logAudit({
                    actorUserId,
                    action,
                    targetUserId
                });
            } catch (err) {
                console.error("Audit error:", err.message);
            }
        });

        next();
    };
}
