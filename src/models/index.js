import sequelize from "../config/database.js";

import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";

const User = UserModel(sequelize);
const Role = RoleModel(sequelize);

User.belongsToMany(Role, { through: "UserRoles" });
Role.belongsToMany(User, { through: "UserRoles" });

export { sequelize, User, Role };