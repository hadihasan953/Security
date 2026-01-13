// src/constants/privileges.js


// Privilege hierarchy as array of objects with Children
export const PRIVILEGES = [
    {
        name: "ADMIN_PRIVILEGE",
        Children: [
            {
                name: "MANAGE_USER",
                Children: [
                    { name: "DELETE_USER", Children: [] },
                    { name: "ENABLE_USER", Children: [] },
                    { name: "DISABLE_USER", Children: [] }
                ]
            },
            { name: "View_DASHBOARD", Children: [] }
        ]
    }
];
// {
//     ADMIN_PRIVILEGE: {
//         name: "ADMIN_PRIVILEGE",
//         Children: []
//     },
//     USER_MANAGEMENT: {
//         name: "USER_MANAGEMENT",
//         Children: [{
//             name: "DELETE_USER",
//             Children: []
//         }
// }