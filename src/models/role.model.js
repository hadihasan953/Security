import { DataTypes } from "sequelize";

const RoleModel = (sequelize) => {
    const Role = sequelize.define("Role", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });
    return Role;
};

export default RoleModel;