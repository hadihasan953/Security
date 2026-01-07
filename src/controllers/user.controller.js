import { User } from "../models/index.js";

export const disableUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user && user.email === "manageuser@system.com") {
        return res.status(403).json({ message: "Cannot disable the primary manage_user account." });
    }
    await User.update(
        { isActive: false },
        { where: { id: req.params.id } }
    );
    res.json({ message: "User disabled successfully" });
};

export const enableUser = async (req, res) => {
    await User.update(
        { isActive: true },
        { where: { id: req.params.id } }
    );
    res.json({ message: "User enabled successfully" });
};


export const deleteUser = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user && user.email === "manageuser@system.com") {
        return res.status(403).json({ message: "Cannot delete the primary manage_user account." });
    }
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
};

import { Privilege } from "../models/index.js";
import { PRIVILEGES } from "../constants/privileges.js";

export const assignPrivilegeToUser = async (req, res) => {
    const { privilegeName } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const privilege = await Privilege.findOne({ where: { name: privilegeName } });
    if (!privilege) return res.status(404).json({ message: "Privilege not found" });
    await user.setPrivileges([privilege]);
    res.json({ message: `Privilege ${privilegeName} assigned to user.` });
};
