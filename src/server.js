import "./config/env.js";
import app from "./app.js";
import { sequelize, Privilege, User } from "./models/index.js";
import { PRIVILEGES } from "./constants/privileges.js";
import bcrypt from "bcrypt";

// Create manage privilege and manage user if not exists
const MANAGE_PRIVILEGE = PRIVILEGES.MANAGE_USER;
const MANAGE_USER_EMAIL = "manageuser@system.com";
const MANAGE_USER_PASSWORD = "ManageUser@123";

// Ensure all privileges from PRIVILEGES constant exist in the database
async function ensureDefaultPrivileges() {
    const privilegeNames = Object.values(PRIVILEGES);
    console.log('Checking privileges:', privilegeNames);
    for (const name of privilegeNames) {
        let privilege = await Privilege.findOne({ where: { name } });
        if (!privilege) {
            await Privilege.create({ name });
            console.log(`✅ Privilege '${name}' created`);
        }
    }
}
const ADMIN_PRIVILEGE = PRIVILEGES.ADMIN_PRIVILEGE;
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

    // Define the privilege hierarchy as an array of objects
    // Each object: { name: privilegeName, parent: parentPrivilegeName or null }
    const hierarchy = [
        { name: PRIVILEGES.ADMIN_PRIVILEGE, parent: null },
        { name: PRIVILEGES.MANAGE_USER, parent: PRIVILEGES.ADMIN_PRIVILEGE },
        { name: PRIVILEGES.View_DASHBOARD, parent: PRIVILEGES.ADMIN_PRIVILEGE },
        { name: PRIVILEGES.DELETE_USER, parent: PRIVILEGES.MANAGE_USER },
        { name: PRIVILEGES.ENABLE_USER, parent: PRIVILEGES.MANAGE_USER },
        { name: PRIVILEGES.DISABLE_USER, parent: PRIVILEGES.MANAGE_USER },
        // Add more privileges and their parents here as needed
    ];

    // First, create or find all privileges
    const privilegeMap = {};
    for (const item of hierarchy) {
        const [priv] = await Privilege.findOrCreate({ where: { name: item.name } });
        privilegeMap[item.name] = priv;
    }

    // Then, set parentId for each privilege
    for (const item of hierarchy) {
        const priv = privilegeMap[item.name];
        let parentId = null;
        if (item.parent) {
            const parentPriv = privilegeMap[item.parent];
            parentId = parentPriv ? parentPriv.id : null;
        }
        if (priv.parentId !== parentId) {
            priv.parentId = parentId;
            await priv.save();
        }
    }
    console.log("Privileges and hierarchy ensured.");
}

sequelize.sync().then(async () => {
    console.log("Database Connected ✔✔");
    await ensureDefaultPrivileges();
    await ensurePrivilegeHierarchy();
    await createAdminUser();
    await createManageUser();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀🚀`);
    });
});