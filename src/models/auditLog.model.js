import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AuditLog = sequelize.define("AuditLog", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    actorUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    targetUserId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "AuditLogs",
    timestamps: true,
    updatedAt: false
});

export default AuditLog;