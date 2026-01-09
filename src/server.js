import "./config/env.js";
import app from "./app.js";
import { sequelize, Privilege, User } from "./models/index.js";


import bcrypt from "bcrypt";


// Create manage privilege and manage user if not exists
const MANAGE_PRIVILEGE = "MANAGE_USER";
const MANAGE_USER_EMAIL = "manageuser@system.com";
const MANAGE_USER_PASSWORD = "ManageUser@123";

async function ensureDefaultPrivileges() {
    const privilegeNames = ["ADMIN_PRIVILEGE", "MANAGE_USER", "DELETE_USER", "DISABLE_USER", "ENABLE_USER"];
    for (const name of privilegeNames) {
        let privilege = await Privilege.findOne({ where: { name } });
        if (!privilege) {
            await Privilege.create({ name });
            console.log(`✅ Privilege '${name}' created`);
        }
    }
}
const ADMIN_PRIVILEGE = "ADMIN_PRIVILEGE";
const ADMIN_USER_EMAIL = "admin@system.com";
const ADMIN_USER_PASSWORD = "AdminUser@123";

async function createAdminUser() {
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

async function createManageUser() {
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



// Create privilege hierarchy with parentId
async function ensurePrivilegeHierarchy() {
    // Set all parentId to null to avoid FK issues
    await Privilege.update({ parentId: null }, { where: {} });

    // Create or find privileges
    const [admin] = await Privilege.findOrCreate({ where: { name: ADMIN_PRIVILEGE } });
    const [manageUser] = await Privilege.findOrCreate({ where: { name: MANAGE_PRIVILEGE } });
    const [deleteUser] = await Privilege.findOrCreate({ where: { name: "DELETE_USER" } });
    const [enableUser] = await Privilege.findOrCreate({ where: { name: "ENABLE_USER" } });
    const [disableUser] = await Privilege.findOrCreate({ where: { name: "DISABLE_USER" } });

    // Hierarchy
    if (manageUser.parentId !== admin.id) {
        manageUser.parentId = admin.id;
        await manageUser.save();
    }
    if (deleteUser.parentId !== manageUser.id) {
        deleteUser.parentId = manageUser.id;
        await deleteUser.save();
    }
    if (enableUser.parentId !== manageUser.id) {
        enableUser.parentId = manageUser.id;
        await enableUser.save();
    }
    if (disableUser.parentId !== manageUser.id) {
        disableUser.parentId = manageUser.id;
        await disableUser.save();
    }
    console.log("Privileges and hierarchy ensured.");
}

sequelize.sync().then(async () => {
    console.log("Database Connected ✔✔");
    await ensurePrivilegeHierarchy();
    await createAdminUser();
    await createManageUser();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀🚀`);
    });
});