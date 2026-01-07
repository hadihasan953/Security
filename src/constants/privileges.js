// src/constants/privileges.js
export const PRIVILEGES = Object.freeze({
    ADMIN_PRIVILEGE: "ADMIN_PRIVILEGE", // parent of MANAGE_USER
    MANAGE_USER: "MANAGE_USER",         // parent of DELETE, ENABLE, DISABLE
    DELETE_USER: "DELETE_USER",
    DISABLE_USER: "DISABLE_USER",
    ENABLE_USER: "ENABLE_USER"
});
