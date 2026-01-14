import "./config/env.js";
import app from "./app.js";
import { sequelize } from "./models/index.js";
import {
    ensureDefaultPrivileges,
    ensurePrivilegeHierarchy,
    createAdminUser,
    createManageUser
} from "./services/privilege.service.js";

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