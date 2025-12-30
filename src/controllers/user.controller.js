import { User, Role } from "../models/index.js";

export const disableUser = async (req, res) => {
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
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "User deleted successfully" });
};

export const assignAdminRole = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    let role = await Role.findOne({ where: { name: "admin" } });
    if (!role) role = await Role.create({ name: "admin" });
    await user.addRole(role);
    res.json({ message: "User promoted to admin" });
};