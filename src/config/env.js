import dotenv from "dotenv";

dotenv.config();

const env = {
    port: process.env.PORT || 3306,
    nodeEnv: process.env.NODE_ENV,

    db: {
        dialect: process.env.DB_DIALECT || "mysql",
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
};

export default env;