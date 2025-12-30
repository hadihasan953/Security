import sequelize from "../config/database.js";

import UserModel from "./user.model.js";

const User = UserModel(sequelize);

export { sequelize, User };