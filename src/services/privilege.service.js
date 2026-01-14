import { Privilege, User } from "../models/index.js";
import { PRIVILEGES } from "../constants/privileges.js";
import bcrypt from "bcrypt";

// Flatten the privilege hierarchy into an object for easy access
function flattenPrivileges(privileges, result = {}) {
    for (const priv of privileges) {
        result[priv.name] = priv.name;
        if (priv.Children && priv.Children.length > 0) {
            flattenPrivileges(priv.Children, result);
        }
    }
    return result;
}

export const PRIV = flattenPrivileges(PRIVILEGES);

// Ensure all privileges from PRIVILEGES constant exist in the database
export async function ensureDefaultPrivileges() {
    const privilegeNames = Object.values(PRIV);
    console.log('Checking privileges:', privilegeNames);
    for (const name of privilegeNames) {
        let privilege = await Privilege.findOne({ where: { name } });
        if (!privilege) {
            await Privilege.create({ name });
            console.log(`✅ Privilege '${name}' created`);
        }
    }
}

// Create privilege hierarchy with parentId
export async function ensurePrivilegeHierarchy() {
    // Set all parentId to null to avoid FK issues
    await Privilege.update({ parentId: null }, { where: {} });

    // Recursively build hierarchy from PRIVILEGES constant
    async function processPrivilegeNode(node, parentPrivilege = null) {
        const [privilege] = await Privilege.findOrCreate({
            where: { name: node.name }
        });

        // Set parent if exists
        if (parentPrivilege && privilege.parentId !== parentPrivilege.id) {
            privilege.parentId = parentPrivilege.id;
            await privilege.save();
        }

        // Process children recursively
        if (node.Children && node.Children.length > 0) {
            for (const child of node.Children) {
                await processPrivilegeNode(child, privilege);
            }
        }
    }

    // Process all root privileges from PRIVILEGES constant
    for (const rootPrivilege of PRIVILEGES) {
        await processPrivilegeNode(rootPrivilege);
    }

    console.log("Privileges and hierarchy ensured from constants.");
}

// Create admin user
export async function createAdminUser() {
    const ADMIN_PRIVILEGE = PRIV.ADMIN_PRIVILEGE;
    const ADMIN_USER_EMAIL = "admin@system.com";
    const ADMIN_USER_PASSWORD = "AdminUser@123";

    let user = await User.findOne({ where: { email: ADMIN_USER_EMAIL } });
    let privilege = await Privilege.findOne({ where: { name: ADMIN_PRIVILEGE } });

    if (!privilege) {
        await ensureDefaultPrivileges();
        privilege = await Privilege.findOne({ where: { name: ADMIN_PRIVILEGE } });
    }
    if (!privilege) throw new Error("Failed to create or fetch ADMIN_PRIVILEGE!");

    if (!user) {
        const password = await bcrypt.hash(ADMIN_USER_PASSWORD, 10);
        user = await User.create({
            name: "System Admin",
            email: ADMIN_USER_EMAIL,
            password,
            isActive: true
        });
        await user.addPrivilege(privilege);
        console.log("✅ Admin user created and privilege assigned");
    } else {
        const privileges = await user.getPrivileges();
        if (!privileges.some(p => p.name === ADMIN_PRIVILEGE)) {
            await user.addPrivilege(privilege);
            console.log("✅ ADMIN_PRIVILEGE assigned to existing admin user");
        } else {
            console.log("Admin user already exists with privilege");
        }
    }
}

// Create manage user
export async function createManageUser() {
    const MANAGE_PRIVILEGE = PRIV.MANAGE_USER;
    const MANAGE_USER_EMAIL = "manageuser@system.com";
    const MANAGE_USER_PASSWORD = "ManageUser@123";

    let user = await User.findOne({ where: { email: MANAGE_USER_EMAIL } });
    let privilege = await Privilege.findOne({ where: { name: MANAGE_PRIVILEGE } });

    if (!privilege) {
        await ensureDefaultPrivileges();
        privilege = await Privilege.findOne({ where: { name: MANAGE_PRIVILEGE } });
    }
    if (!privilege) throw new Error("Failed to create or fetch MANAGE_USER privilege!");

    if (!user) {
        const password = await bcrypt.hash(MANAGE_USER_PASSWORD, 10);
        user = await User.create({
            name: "Manage User",
            email: MANAGE_USER_EMAIL,
            password,
            isActive: true,
        });
        await user.addPrivilege(privilege);
        console.log("✅ Manage user created and privilege assigned");
    } else {
        const privileges = await user.getPrivileges();
        if (!privileges.some(p => p.name === MANAGE_PRIVILEGE)) {
            await user.addPrivilege(privilege);
            console.log("✅ MANAGE_USER privilege assigned to existing user");
        } else {
            console.log("Manage user already exists with privilege");
        }
    }
}
