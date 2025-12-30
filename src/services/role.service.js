import { User, Role } from "../models/index.js";

export const changeUserRole = async (targetUserId, roleName) => {
    if (!["admin", "user"].includes(roleName)) {
        throw new Error("Invalid role name");
    }
    const user = await User.findByPk(targetUserId);
    if (!user) throw new Error("User not found");

    const role = await Role.findOne({
        where: { name: roleName }
    });
    await user.setRoles([role]);
};