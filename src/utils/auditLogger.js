import AuditLog from "../models/auditLog.model.js";


export async function logAudit({
    actorUserId,
    action,
    targetType = null,
    targetUserId = null,
    targetId = null,
    ipAddress = null,
    details = null
}) {
    await AuditLog.create({
        actorUserId,
        action,
        targetType,
        targetUserId,
        targetId,
        ipAddress,
        details
    });
}
