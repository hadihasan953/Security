import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { User, Privilege, AuditLog } from "../models/index.js"; // Added AuditLog

// Helper to recursively get all descendant privilege names
async function getAllPrivilegeNames(privileges) {
    const allNames = new Set();
    const queue = [...privileges];
    while (queue.length > 0) {
        const priv = queue.shift();
        if (!allNames.has(priv.name)) {
            allNames.add(priv.name);
            // Find children
            const children = await Privilege.findAll({ where: { parentId: priv.id } });
            queue.push(...children);
        }
    }
    return Array.from(allNames);
}

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
            return res.status(401).json({ message: "Token required" });
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, env.jwt.secret);
        } catch {
            return res.status(401).json({ message: "Invalid token" });
        }

        // Fetch user and their privileges
        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ["password"] },
            include: [{ model: Privilege, through: { attributes: [] } }]
        });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: "User account is disabled" });
        }

        // privileges
        req.user = user;
        req.user.privileges = user.Privileges && user.Privileges.length > 0
            ? await getAllPrivilegeNames(user.Privileges)
            : [];

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};
