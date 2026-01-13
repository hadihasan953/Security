import { User, AuditLog } from "../models/index.js";

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            include: [{ model: User, attributes: ["id", "email"] }],
            order: [["createdAt", "DESC"]],
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};