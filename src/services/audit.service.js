import AuditLog from "../models/auditLog.model.js";

export async function logAudit({ actorUserId, action, targetUserId }) {
    try {
        await AuditLog.create({
            actorUserId,
            action,
            targetUserId
        });
    } catch (error) {
        console.error("Audit log error:", error.message);
    }
}
