import { changeUserRole } from "../services/role.service.js";

export const updateUserRole = async (req, res) => {
    try {
        await changeUserRole(req.params.id, req.body.role);
        res.json({ message: "User role updated successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};