import "./config/env.js";
import app from "./app.js";
import { sequelize } from "./models/index.js";

import bcrypt from "bcrypt";
import { User, Role } from "./models/index.js";

// Create manage_user if not exists
const MANAGE_USER_EMAIL = "manageuser@system.com";
const MANAGE_USER_PASSWORD = "ManageUser@123";
async function ensureDefaultRoles() {
    const roleNames = ["user", "manage_user"];
    for (const name of roleNames) {
        let role = await Role.findOne({ where: { name } });
        if (!role) {
            await Role.create({ name });
            console.log(`✅ Role '${name}' created`);
        }
    }
}

async function createManageUser() {
    let user = await User.findOne({ where: { email: MANAGE_USER_EMAIL } });
    let role = await Role.findOne({ where: { name: "manage_user" } });
    if (!role) {
        await ensureDefaultRoles();
        role = await Role.findOne({ where: { name: "manage_user" } });
    }
    if (!role) throw new Error("Failed to create or fetch manage_user role!");

    if (!user) {
        const password = await bcrypt.hash(MANAGE_USER_PASSWORD, 10);
        user = await User.create({
            name: "Manage User",
            email: MANAGE_USER_EMAIL,
            password,
            isActive: true,
        });
        await user.addRole(role);
        console.log("✅ Manage user created");
    } else {
        const roles = await user.getRoles();
        if (!roles.some(r => r.name === "manage_user")) {
            await user.addRole(role);
            console.log("✅ Manage user role assigned to existing user");
        } else {
            console.log("Manage user already exists");
        }
    }
}


sequelize.sync().then(async () => {
    console.log("Database Connected ✔✔");
    await ensureDefaultRoles();
    await createManageUser();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀🚀`);
    });
});