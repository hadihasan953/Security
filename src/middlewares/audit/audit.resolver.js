// src/middlewares/audit/audit.resolver.js

export function resolveAuditAction(req, actionMap) {
    const method = req.method;
    const path = `${req.baseUrl}${req.route?.path}`;

    return actionMap[`${method} ${path}`] || null;
}

export function resolveTargetUserId(req) {
    return req.params?.id || req.params?.userId || null;
}
