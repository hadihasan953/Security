import "./config/env.js";
import app from "./app.js";
import { sequelize, Privilege, User } from "./models/index.js";


import bcrypt from "bcrypt";


// Create manage privilege and manage user if not exists
const MANAGE_PRIVILEGE = "MANAGE_USER";
const MANAGE_USER_EMAIL = "manageuser@system.com";
const MANAGE_USER_PASSWORD = "ManageUser@123";

async function ensureDefaultPrivileges() {
    const privilegeNames = ["MANAGE_USER", "DELETE_USER", "DISABLE_USER", "ENABLE_USER"];
    for (const name of privilegeNames) {
        let privilege = await Privilege.findOne({ where: { name } });
        if (!privilege) {
            await Privilege.create({ name });
            console.log(`✅ Privilege '${name}' created`);
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


sequelize.sync().then(async () => {
    console.log("Database Connected ✔✔");
    await ensureDefaultPrivileges();
    await createManageUser();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀🚀`);
    });
});