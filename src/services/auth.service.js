import { User, Privilege } from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (data) => {
    const { name, email, password } = data;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
        throw new Error("User already exists");

    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    // Assign 'USER' privilege by default
    let privilege = await Privilege.findOne({ where: { name: "USER" } });
    if (!privilege) privilege = await Privilege.create({ name: "USER" });
    await user.addPrivilege(privilege);
    return user;
};

export const loginUser = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });
    if (!user)
        throw new Error("User not found");

    if (!user.isActive) {
        throw new Error("User account is deactived");
    }

    const valid = await comparePassword(password, user.password);
    if (!valid)
        throw new Error("Invalid email or password");

    const token = generateToken({ id: user.id });

    return token;
};
