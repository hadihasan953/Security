import { User } from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
        throw new Error("User already exists");

        const hashedPassword = await hashPassword(password);
        return User.create({
            name,
            email,
            password: hashedPassword,
        });
    };

    export const loginUser = async (data) => {
        const { email, password } = data;

        const user = await User.findOne({ where: { email } });
        if (!user) 
            throw new Error("User not found");

        const valid = await comparePassword(password, user.password);
        if (!valid)
            throw new Error("Invalid email or password");

        const token = generateToken({ id: user.id });

        return token;
    };
