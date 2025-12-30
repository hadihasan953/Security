import "./config/env.js";
import app from "./app.js";
import { sequelize } from "./models/index.js";

import bcrypt from "bcrypt";
import { User, Role } from "./models/index.js";

// Create main_admin if not exists
const MAIN_ADMIN_EMAIL = "mainadmin@system.com";
const MAIN_ADMIN_PASSWORD = "MainAdmin@123";
async function createMainAdmin() {
    let user = await User.findOne({ where: { email: MAIN_ADMIN_EMAIL } });
    let role = await Role.findOne({ where: { name: "main_admin" } });
    if (!role) role = await Role.create({ name: "main_admin" });
    if (!user) {
        const password = await bcrypt.hash(MAIN_ADMIN_PASSWORD, 10);
        user = await User.create({
            name: "Main Admin",
            email: MAIN_ADMIN_EMAIL,
            password,
            isActive: true,
        });
        await user.addRole(role);
        console.log("✅ Main admin created");
    } else {
        const roles = await user.getRoles();
        if (!roles.some(r => r.name === "main_admin")) {
            await user.addRole(role);
            console.log("✅ Main admin role assigned to existing user");
        } else {
            console.log("Main admin already exists");
        }
    }
}


sequelize.sync().then(async () => {
    console.log("Database Connected ✔✔");
    await createMainAdmin();
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT} 🚀🚀`);
    });
});