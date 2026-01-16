// src/middlewares/audit/audit.actions.js

export const AUDIT_ACTIONS = {
    "POST /auth/login": "LOGIN",
    "POST /auth/register": "AUTH_REGISTER",

    "DELETE /users/:id": "USER_DELETE",
    "PATCH /users/:id/disabled": "USER_DISABLE",
    "PATCH /users/:id/enabled": "USER_ENABLE",
    "PATCH /users/me/password": "USER_PASSWORD_UPDATE",

    "POST /users/:id/privileges": "PRIVILEGE_ASSIGN",
    "DELETE /users/:id/privileges": "PRIVILEGE_REVOKE",

    "GET /dashboard/:id": "VIEW_DASHBOARD",
    "GET /privileges/dashboard/:id": "VIEW_DASHBOARD",
    "GET /audit-logs": "VIEW_AUDIT_LOGS",
    "GET /audit-logs/": "VIEW_AUDIT_LOGS"
};
