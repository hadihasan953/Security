import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = (payload) => {
    return jwt.sign(payload,
        process.env.JWT_SECRET, {
        expiresIn: env.jwt.expiresIn,
    });
};