// Use roles already attached to req.user by authenticate middleware
export const authorizeRole = (roles = []) => {
    return (req, res, next) => {
        try {
            const names = req.user.roles || [];
            if (!roles.some(r => names.includes(r))) {
                return res.status(403).json({ message: "Access denied" });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};