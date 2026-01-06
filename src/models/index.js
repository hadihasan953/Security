import sequelize from "../config/database.js";

import UserModel from "./user.model.js";
import PrivilegeModel from "./privilege.model.js";

const User = UserModel(sequelize);
const Privilege = PrivilegeModel(sequelize);

// User <-> Privilege (many-to-many)
User.belongsToMany(Privilege, { through: "UserPrivileges" });
Privilege.belongsToMany(User, { through: "UserPrivileges" });

export { sequelize, User, Privilege };