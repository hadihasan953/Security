import AuditLog from "../models/auditLog.model.js";


export async function logAudit({
    actorUserId,
    action,
    targetUserId = null,
}) {
    await AuditLog.create({
        actorUserId,
        action,
        targetUserId,
    });
}
