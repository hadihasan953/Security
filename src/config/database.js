import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import env from "./env.js";

const sequelize = new Sequelize(
    env.db.name,
    env.db.user,
    env.db.password,
    {
        host: env.db.host,
        post: env.db.port,
        dialect: env.db.dialect,
        logging: false,
    }
);

export default sequelize;