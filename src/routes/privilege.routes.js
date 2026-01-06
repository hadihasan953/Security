import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizePrivilege } from "../middlewares/privilege.middleware.js";
import { PRIVILEGES } from "../constants/privileges.js";
import { User, Privilege } from "../models/index.js";

const router = express.Router();

// Grant a privilege to a user
router.post("/:id/privileges", authenticate, authorizePrivilege([PRIVILEGES.MANAGE_USER]), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const { privilege } = req.body;
        const priv = await Privilege.findOne({ where: { name: privilege } });
        if (!user || !priv) return res.status(404).json({ message: "User or privilege not found" });
        await user.addPrivilege(priv);
        res.json({ message: `Privilege '${privilege}' granted to user.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Revoke a privilege from a user
router.delete("/:id/privileges", authenticate, authorizePrivilege([PRIVILEGES.MANAGE_USER]), async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        const { privilege } = req.body;
        const priv = await Privilege.findOne({ where: { name: privilege } });
        if (!user || !priv) return res.status(404).json({ message: "User or privilege not found" });
        await user.removePrivilege(priv);
        res.json({ message: `Privilege '${privilege}' revoked from user.` });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
