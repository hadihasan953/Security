// src/middlewares/audit/audit.factory.js

// import { logAudit } from "../services/audit.service.js";

// export function auditMiddleware({
//     actionMap,
//     resolveTargetUserId
// }) {
//     return (req, res, next) => {
//         res.on("finish", async () => {
//             try {
//                 if (res.statusCode < 200 || res.statusCode >= 300) return;

//                 const action = actionMap
//                     ? actionMap[`${req.method} ${req.baseUrl}${req.route?.path}`]
//                     : null;

//                 if (!action) return;

//                 const actorUserId =
//                     req.user?.id ||
//                     req.token?.userId ||
//                     req.loginUserId ||
//                     null;

//                 const targetUserId = resolveTargetUserId(req);

//                 await logAudit({
//                     actorUserId,
//                     action,
//                     targetUserId
//                 });
//             } catch (err) {
//                 console.error("Audit error:", err.message);
//             }
//         });

//         next();
//     };
// }










// // src/middlewares/audit.middleware.js

// import { logAudit } from "../services/audit.service.js";


// // Configurable action resolver using rules
// function createResolveAuditAction(rules = []) {
//     return function resolveAuditAction(req) {
//         const method = req.method;
//         const basePath = req.baseUrl;
//         const routePath = req.route?.path;

//         for (const rule of rules) {
//             const methodMatch = !rule.method || rule.method === method;
//             const basePathMatch = !rule.basePath || (typeof rule.basePath === 'function' ? rule.basePath(basePath) : basePath.includes(rule.basePath));
//             const routePathMatch = !rule.routePath || rule.routePath === routePath;
//             if (methodMatch && basePathMatch && routePathMatch) {
//                 return rule.action;
//             }
//         }
//         return "UNKNOWN_ACTION";
//     };
// }

// // Default rules for audit actions
// const defaultAuditActionRules = [
//     { method: "POST", basePath: "auth", routePath: "/login", action: "LOGIN" },
//     { method: "POST", basePath: "auth", routePath: "/register", action: "AUTH_REGISTER" },
//     { method: "DELETE", basePath: "users", routePath: "/:id", action: "USER_DELETE" },
//     { method: "PATCH", basePath: "users", routePath: "/:id/disabled", action: "USER_DISABLE" },
//     { method: "PATCH", basePath: "users", routePath: "/:id/enabled", action: "USER_ENABLE" },
//     { method: "PATCH", basePath: "users", routePath: "/me/password", action: "USER_PASSWORD_UPDATE" },
//     { method: "POST", basePath: "privileges", routePath: "/:id/privileges", action: "PRIVILEGE_ASSIGN" },
//     { method: "DELETE", basePath: "privileges", routePath: "/:id/privileges", action: "PRIVILEGE_REVOKE" },
//     { method: "GET", basePath: "privileges", routePath: "/dashboard/:id", action: "VIEW_DASHBOARD" },
// ];


// // Factory for resolving target user id, can be customized
// function defaultResolveTargetUserId(req) {
//     if (req.params?.id) return req.params.id;
//     if (req.params?.userId) return req.params.userId;
//     return null;
// }


// /**
//  * Factory for audit middleware
//  * @param {Object} options
//  * @param {Function} [options.resolveAuditAction] - Custom function to resolve audit action
//  * @param {Function} [options.resolveTargetUserId] - Custom function to resolve target user id
//  */
// export function createAuditMiddleware(options = {}) {
//     const {
//         rules = defaultAuditActionRules,
//         resolveAuditAction = createResolveAuditAction(rules),
//         resolveTargetUserId = defaultResolveTargetUserId
//     } = options;

//     return (req, res, next) => {
//         res.on("finish", async () => {
//             try {
//                 // Log ONLY successful responses
//                 if (res.statusCode < 200 || res.statusCode >= 300) return;

//                 const action = resolveAuditAction(req);

//                 if (action === "UNKNOWN_ACTION") {
//                     console.warn("Audit: UNKNOWN_ACTION route:", req.method, req.originalUrl);
//                     return;
//                 }

//                 const targetUserId = resolveTargetUserId(req);

//                 // For login/register, get user ID from the response or loginUserId stored
//                 let actorUserId = req.user?.id || req.token?.userId || req.loginUserId || null;

//                 await logAudit({
//                     actorUserId,
//                     action,
//                     targetUserId
//                 });
//             } catch (error) {
//                 console.error("Audit middleware error:", error.message);
//             }
//         });

//         next();
//     };
// }

// // Default instance for backward compatibility
// export const auditMiddleware = createAuditMiddleware();




// // // src/middlewares/audit.middleware.js

// // import { logAudit } from "../services/audit.service.js";


// // // Factory for resolving audit action, can be customized
// // function defaultResolveAuditAction(req) {
// //     const method = req.method;
// //     const basePath = req.baseUrl;
// //     const routePath = req.route?.path;

// //     // AUTH
// //     if (basePath.includes("auth") && method === "POST" && routePath === "/login")
// //         return "LOGIN";

// //     if (basePath.includes("auth") && method === "POST" && routePath === "/register")
// //         return "AUTH_REGISTER";

// //     // USERS
// //     if (basePath.includes("users")) {
// //         if (method === "DELETE" && routePath === "/:id")
// //             return "USER_DELETE";

// //         if (method === "PATCH" && routePath === "/:id/disabled")
// //             return "USER_DISABLE";

// //         if (method === "PATCH" && routePath === "/:id/enabled")
// //             return "USER_ENABLE";

// //         if (basePath.includes("me") && method === "PATCH" && routePath === "/password")
// //             return "USER_PASSWORD_UPDATE";
// //     }

// //     // PRIVILEGES
// //     if (basePath.includes("privileges")) {
// //         if (method === "POST" && routePath === "/:id/privileges")
// //             return "PRIVILEGE_ASSIGN";

// //         if (method === "DELETE" && routePath === "/:id/privileges")
// //             return "PRIVILEGE_REVOKE";

// //         if (method === "GET" && routePath === "/dashboard/:id")
// //             return "VIEW_DASHBOARD";
// //     }

// //     return "UNKNOWN_ACTION";
// // }


// // // Factory for resolving target user id, can be customized
// // function defaultResolveTargetUserId(req) {
// //     if (req.params?.id) return req.params.id;
// //     if (req.params?.userId) return req.params.userId;
// //     return null;
// // }


// // /**
// //  * Factory for audit middleware
// //  * @param {Object} options
// //  * @param {Function} [options.resolveAuditAction] - Custom function to resolve audit action
// //  * @param {Function} [options.resolveTargetUserId] - Custom function to resolve target user id
// //  */
// // export function createAuditMiddleware(options = {}) {
// //     const {
// //         resolveAuditAction = defaultResolveAuditAction,
// //         resolveTargetUserId = defaultResolveTargetUserId
// //     } = options;

// //     return (req, res, next) => {
// //         res.on("finish", async () => {
// //             try {
// //                 // Log ONLY successful responses
// //                 if (res.statusCode < 200 || res.statusCode >= 300) return;

// //                 const action = resolveAuditAction(req);

// //                 if (action === "UNKNOWN_ACTION") {
// //                     console.warn("Audit: UNKNOWN_ACTION route:", req.method, req.originalUrl);
// //                     return;
// //                 }

// //                 const targetUserId = resolveTargetUserId(req);

// //                 // For login/register, get user ID from the response or loginUserId stored
// //                 let actorUserId = req.user?.id || req.token?.userId || req.loginUserId || null;

// //                 await logAudit({
// //                     actorUserId,
// //                     action,
// //                     targetUserId
// //                 });
// //             } catch (error) {
// //                 console.error("Audit middleware error:", error.message);
// //             }
// //         });

// //         next();
// //     };
// // }

// // // Default instance for backward compatibility
// // export const auditMiddleware = createAuditMiddleware();
