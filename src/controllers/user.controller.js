import { User, Privilege, AuditLog } from "../models/index.js";
import { logAudit } from "../utils/auditLogger.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Old and new password are required." });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        // ✅ AUDIT LOG
        await AuditLog.create({
            actorUserId: userId,
            action: "UPDATE_PASSWORD",
            entityType: "User",
            entityId: userId,
            details: "User updated their own password"
        });

        res.json({ message: "Password updated successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const disableUser = async (req, res) => {
    const targetUser = await User.findByPk(req.params.id, {
        include: [Privilege]
    });

    if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.email === "manageuser@system.com") {
        return res.status(403).json({ message: "Cannot disable the primary manage_user account." });
    }

    if (targetUser.Privileges?.some(p => p.name === "ADMIN_PRIVILEGE")) {
        return res.status(403).json({ message: "Cannot disable a user with ADMIN_PRIVILEGE." });
    }

    await User.update(
        { isActive: false },
        { where: { id: req.params.id } }
    );

    // ✅ AUDIT LOG
    await logAudit({
        actorUserId: req.user.id,
        action: "DISABLE_USER",
        targetType: "User",
        targetUserId: targetUser.id,
        details: `User ${req.params.id} was disabled`
    });

    res.json({ message: "User disabled successfully" });
};


export const enableUser = async (req, res) => {
    await User.update(
        { isActive: true },
        { where: { id: req.params.id } }
    );

    // ✅ AUDIT LOG
    await logAudit({
        actorUserId: req.user.id,
        action: "ENABLE_USER",
        targetType: "User",
        targetUserId: parseInt(req.params.id),
        details: `User ${req.params.id} was enabled`
    });

    res.json({ message: "User enabled successfully" });
};


export const deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.email === "manageuser@system.com") {
        return res.status(403).json({ message: "Cannot delete the primary manage_user account." });
    }

    // Soft disable before delete
    await User.update({ isActive: false }, { where: { id: req.params.id } });
    await User.destroy({ where: { id: req.params.id } });

    // ✅ AUDIT LOG
    await logAudit({
        actorUserId: req.user.id,
        action: "DELETE_USER",
        targetType: "User",
        targetUserId: user.id,
        details: `User ${req.params.id} was deleted`
    });

    res.json({ message: "User deleted successfully" });
};

export const assignPrivilegeToUser = async (req, res) => {
    const { privilegeName } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const privilege = await Privilege.findOne({
        where: { name: privilegeName }
    });

    if (!privilege) {
        return res.status(404).json({ message: "Privilege not found" });
    }

    await user.setPrivileges([privilege]);

    // ✅ AUDIT LOG
    await AuditLog.create({
        actorUserId: req.user.id,
        action: "ASSIGN_PRIVILEGE",
        entityType: "User",
        entityId: req.params.id,
        details: `Assigned privilege ${privilegeName} to user`
    });

    res.json({ message: `Privilege ${privilegeName} assigned to user.` });
};
