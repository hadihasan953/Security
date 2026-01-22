# Security Backend

This project is a Node.js/Express backend for user management, privilege control, and audit logging. It uses Sequelize ORM and supports JWT authentication, privilege-based authorization, and detailed audit trails.

## Features
- User registration and authentication
- Privilege management (grant/revoke)
- Admin and manage user roles
- Audit logging for key actions
- Soft delete support (paranoid)

## Project Structure
- `src/controllers/` — Route controllers
- `src/services/` — Business logic and database operations
- `src/routes/` — Express route definitions
- `src/middlewares/` — Authentication, authorization, and audit middleware
- `src/models/` — Sequelize models
- `src/constants/` — Privilege and other constants
- `src/utils/` — Utility functions

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables in `src/config/env.js` or a `.env` file.
3. Run database migrations if needed.
4. Start the server:
   ```bash
   npm start
   ```

## Usage
- Register users via the API.
- Grant/revoke privileges using the appropriate endpoints (requires MANAGE_USER or ADMIN_PRIVILEGE).
- All key actions are logged in the audit log for security and compliance.

## Notes
- The first registered user is given ADMIN_PRIVILEGE by default.
- Privileges are enforced by middleware and route logic.
- See code comments for details on privilege checks and audit logging.

---
Feel free to customize this README for your project needs.
