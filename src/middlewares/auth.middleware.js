import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { User, Privilege } from "../models/index.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
            return res.status(401).json({ message: "Token required" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, env.jwt.secret);

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
        req.user.privileges = user.Privileges ? user.Privileges.map(p => p.name) : [];
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};