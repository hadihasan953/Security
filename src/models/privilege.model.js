import { DataTypes } from "sequelize";

const PrivilegeModel = (sequelize) => {
    return sequelize.define("Privilege", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    });
};

export default PrivilegeModel;
