import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { token, userId } = await loginUser(req.body);

        // Store userId in request for audit middleware
        req.loginUserId = userId;

        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
