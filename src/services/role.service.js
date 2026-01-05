import { User, Role } from "../models/index.js";
import { ROLES } from "../constants/roles.js";

export const changeUserRole = async (targetUserId, roleName) => {
    let finalRoleName;
    if (roleName === ROLES.MANAGE_USER) {
        finalRoleName = ROLES.MANAGE_USER;
    } else {
        finalRoleName = ROLES.USER;
    }
    const user = await User.findByPk(targetUserId);
    if (!user) throw new Error("User not found");

    // Prevent demoting the primary manage_user account
    if (user.email === "manageuser@system.com" && finalRoleName === ROLES.USER) {
        throw new Error("Cannot demote the primary manage_user account.");
    }

    const role = await Role.findOne({
        where: { name: finalRoleName }
    });
    if (!role) throw new Error("Role not found");
    await user.setRoles([role]);
};