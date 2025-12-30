export const authorizeRole = (roles = []) => {
    return async (req, res, next) => {
        try {
            const userRoles = await req.user.getRoles();
            const names = userRoles.map(r => r.name);
            if (!roles.some(r => names.includes(r))) {
                return res.status(403).json({ message: "Access denied" });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};